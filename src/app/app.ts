// Autor: Dayra Mayerly Mosquera Cabrera
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipoService } from './services/equipo.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']    
})
export class App implements OnInit {
  titulo = 'Inventario de Equipos Tecnológicos de la ESPE';
  
  // Arreglos y variables para los datos
  equipos: any[] = [];
  codigoBusqueda: string = '';
  equipoEncontrado: any = null;

  // Modelo para el formulario de registro
  nuevoEquipo = {
    codigo: '',
    nombre: '',
    categoria: '',
    laboratorio: '',
    estado: 'Operativo',
    responsable: 'Dayra Mosquera'
  };

  constructor(
    public equipoService: EquipoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarEquipos();
  }

  // 1. Consultar todos los equipos
  cargarEquipos() {
    this.equipoService.getEquipos().then((data: any) => {
      this.equipos = data;
      this.cdr.detectChanges();
    }).catch(err => console.error("Error al cargar equipos:", err));
  }

  // 2. Buscar un equipo por código
  buscarEquipo() {
    if (!this.codigoBusqueda.trim()) {
      alert("Ingrese un código para buscar.");
      return;
    }
    this.equipoService.getEquipoByCodigo(this.codigoBusqueda.trim()).then((data: any) => {
      this.equipoEncontrado = data && data.codigo ? data : null;
      if (!this.equipoEncontrado) {
        alert("No se encontró ningún equipo con ese código.");
      }
      this.cdr.detectChanges();
    }).catch(err => console.error("Error en la búsqueda:", err));
  }

  // 3. Registrar un nuevo equipo
  registrarEquipo() {
    if (!this.nuevoEquipo.codigo || !this.nuevoEquipo.nombre) {
      alert("Por favor complete al menos el código y el nombre.");
      return;
    }

    this.equipoService.saveEquipo(this.nuevoEquipo).then((res: any) => {
      alert(res.mensaje || "Equipo registrado exitosamente");
      this.cargarEquipos();
      // Limpiamos campos básicos
      this.nuevoEquipo = { codigo: '', nombre: '', categoria: '', laboratorio: '', estado: 'Operativo', responsable: 'Dayra Mosquera' };
      this.cdr.detectChanges();
    }).catch(err => {
      console.error("Error al registrar:", err);
      alert("Error al registrar el equipo (verifique que el código no esté repetido).");
    });
  }

  // 4. Actualizar el estado de un equipo
  actualizarEstado(codigo: string, nuevoEstado: string) {
    this.equipoService.updateEstadoEquipo(codigo, { estado: nuevoEstado }).then((res: any) => {
      alert(res.mensaje || "Estado actualizado exitosamente");
      this.cargarEquipos();
      this.cdr.detectChanges();
    }).catch(err => console.error("Error al actualizar estado:", err));
  }
}
