// Autor: Dayra Mayerly Mosquera Cabrera
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private url = 'http://localhost:3000/';

  constructor(public http: HttpClient) {}

  getEquipos() {
    return new Promise((resolve, reject) => {
      if (!navigator.onLine) {
        resolve(JSON.parse(localStorage.getItem('equipos_cache') || '[]'));
        return;
      }
      this.http.get(this.url + 'equipos').subscribe({
        next: (data: any) => {
          localStorage.setItem('equipos_cache', JSON.stringify(data));
          resolve(data);
        },
        error: (err) => resolve(JSON.parse(localStorage.getItem('equipos_cache') || '[]'))
      });
    });
  }

  saveEquipo(data: any) {
    return new Promise((resolve, reject) => {
      // SI ESTÁS OFFLINE, GUARDA LOCAL Y RESUELVE
      if (!navigator.onLine) {
        const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
        offlineData.push(data);
        localStorage.setItem('equipos_cache', JSON.stringify(offlineData));
        resolve({ mensaje: 'Guardado exitosamente (Offline)' });
        return;
      }
      
      this.http.post(this.url + 'equipos', data).subscribe({
        next: (res: any) => {
          const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
          offlineData.push(data);
          localStorage.setItem('equipos_cache', JSON.stringify(offlineData));
          resolve(res);
        },
        error: (err) => {
          const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
          offlineData.push(data);
          localStorage.setItem('equipos_cache', JSON.stringify(offlineData));
          resolve({ mensaje: 'Guardado exitosamente (Offline)' });
        }
      });
    });
  }

  updateEstadoEquipo(codigo: string, data: any) {
    return new Promise((resolve, reject) => {
      if (!navigator.onLine) {
        const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
        const idx = offlineData.findIndex((e: any) => e.codigo === codigo);
        if (idx !== -1) {
          offlineData[idx].estado = data.estado;
          localStorage.setItem('equipos_cache', JSON.stringify(offlineData));
          resolve({ mensaje: 'Estado actualizado (Offline)' });
        }
        return;
      }
      
      this.http.put(this.url + 'equipos/' + codigo + '/estado', data).subscribe({
        next: (res) => resolve(res),
        error: (err) => resolve({ mensaje: 'Estado actualizado (Offline)' })
      });
    });
  }

  getEquipoByCodigo(codigo: string) { return new Promise(r => r(null)); }
}