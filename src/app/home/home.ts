import { Component } from '@angular/core';
import { Productoservice } from '../core/services/productoservice';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  productos: any[] = [];
  mostrarForm = false;

  // Objeto para los datos del nuevo producto (todos string)
  nuevoProducto = {
    nombre: '',
    precio: '',
    categoria_id: ''
  };

  constructor(private productoService: Productoservice) {
    this.listarProductos();
  }

  listarProductos(): void {
    this.productoService.listaProductos().subscribe({
      next: (data) => {
        this.productos = data;
        console.log('Productos cargados:', this.productos);
      },
      error: (err) => console.error('Error al cargar productos', err)
    });
  }

  mostrarFormulario() {
    this.mostrarForm = true;
    // ✅ Inicializa con strings vacíos (consistente con la definición)
    this.nuevoProducto = { nombre: '', precio: '', categoria_id: '' };
  }

  cancelar() {
    this.mostrarForm = false;
  }

  guardarProducto() {
    // Validación básica: todos deben tener contenido
    if (
      !this.nuevoProducto.nombre.trim() ||
      !this.nuevoProducto.precio.trim() ||
      !this.nuevoProducto.categoria_id.trim()
    ) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // Convertir a números
    const precioStr = this.nuevoProducto.precio.replace(',', '.');
    const precio = parseFloat(precioStr);
    const categoria_id = parseInt(this.nuevoProducto.categoria_id.trim(), 10);

    if (isNaN(precio) || precio <= 0) {
      alert('El precio debe ser un número válido mayor que 0.');
      return;
    }

    if (isNaN(categoria_id) || categoria_id <= 0) {
      alert('El ID de categoría debe ser un número entero mayor que 0.');
      return;
    }

    // Objeto final para enviar
    const productoParaEnviar = {
      nombre: this.nuevoProducto.nombre.trim(),
      precio: precio,
      categoria_id: categoria_id
    };

    this.productoService.crearProducto(productoParaEnviar).subscribe({
      next: (response) => {
        alert('✅ Producto guardado correctamente!');
        this.mostrarForm = false;
        this.listarProductos();
      },
      error: (err) => {
        console.error('Error al crear producto:', err);
        alert('❌ Error al guardar el producto');
      }
    });
  }
}