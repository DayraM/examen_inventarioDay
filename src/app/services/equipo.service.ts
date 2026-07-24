// Autor: Dayra Mayerly Mosquera Cabrera
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EquipoService {
  private url = 'http://localhost:3000/';

  constructor(public http: HttpClient) {}

  // 1. Consultar todos los equipos
  getEquipos() {
    return new Promise((resolve, reject) => {
      if (!navigator.onLine) {
        const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
        resolve(offlineData);
        return;
      }

      this.http.get(this.url + 'equipos').subscribe({
        next: (data: any) => {
          localStorage.setItem('equipos_cache', JSON.stringify(data));
          resolve(data);
        },
        error: (err) => {
          const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
          resolve(offlineData);
        }
      });
    });
  }

  // 2. Buscar un equipo por código
  getEquipoByCodigo(codigo: string) {
    return new Promise((resolve, reject) => {
      if (!navigator.onLine) {
        const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
        const encontrado = offlineData.find((eq: any) => eq.codigo === codigo);
        resolve(encontrado || null);
        return;
      }

      this.http.get(this.url + 'equipos/' + codigo).subscribe({
        next: (data) => resolve(data),
        error: (err) => {
          const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
          const encontrado = offlineData.find((eq: any) => eq.codigo === codigo);
          resolve(encontrado || null);
        }
      });
    });
  }

  // 3. Registrar un nuevo equipo
  saveEquipo(data: any) {
    return new Promise((resolve, reject) => {
      if (!navigator.onLine) {
        const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
        const existe = offlineData.some((eq: any) => eq.codigo === data.codigo);
        if (existe) {
          reject({ message: 'El código ya existe en el registro local.' });
          return;
        }
        offlineData.push(data);
        localStorage.setItem('equipos_cache', JSON.stringify(offlineData));
        resolve({ mensaje: 'Equipo registrado exitosamente en modo offline (local)' });
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
          resolve({ mensaje: 'Equipo registrado exitosamente en modo offline (local)' });
        }
      });
    });
  }

  // 4. Actualizar el estado de un equipo
  updateEstadoEquipo(codigo: string, data: any) {
    return new Promise((resolve, reject) => {
      if (!navigator.onLine) {
        const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
        const index = offlineData.findIndex((eq: any) => eq.codigo === codigo);
        if (index !== -1) {
          offlineData[index].estado = data.estado;
          localStorage.setItem('equipos_cache', JSON.stringify(offlineData));
          resolve({ mensaje: 'Estado actualizado localmente en modo offline' });
        } else {
          reject({ message: 'Equipo no encontrado localmente' });
        }
        return;
      }

      this.http.put(this.url + 'equipos/' + codigo + '/estado', data).subscribe({
        next: (res) => resolve(res),
        error: (err) => {
          const offlineData = JSON.parse(localStorage.getItem('equipos_cache') || '[]');
          const index = offlineData.findIndex((eq: any) => eq.codigo === codigo);
          if (index !== -1) {
            offlineData[index].estado = data.estado;
            localStorage.setItem('equipos_cache', JSON.stringify(offlineData));
            resolve({ mensaje: 'Estado actualizado localmente en modo offline' });
          } else {
            reject({ message: 'Equipo no encontrado localmente' });
          }
        }
      });
    });
  }
}