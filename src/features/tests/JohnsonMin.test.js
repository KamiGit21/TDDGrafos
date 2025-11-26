import { describe, it, expect, beforeEach, test } from 'vitest';
import { mount } from '@vue/test-utils';
import JohnsonMin from '../Johnson/components/JohnsonMin.vue';

/**
 * Clase de pruebas para JohnsonMin (Algoritmo de Johnson - Minimización)
 */
describe('JohnsonMin - Algoritmo de Johnson para Minimización', () => {
  let wrapper;
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      theme: 'light-theme',
      nodes: [],
      edges: []
    };
  });

  /**
   * @Test - PRUEBA 1
   * Verifica que calcule correctamente Early Finish (EF) para un grafo lineal simple
   * Grafo: A(0) --5--> B(5) --3--> C(8)
   */
  test('debería calcular correctamente los tiempos Early Finish (EF) en un grafo lineal', () => {
    // 1. Preparación de la prueba
    const props = {
      ...defaultProps,
      nodes: [
        { id: 1, label: 'A', x: 100, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 2, label: 'B', x: 300, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 3, label: 'C', x: 500, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' }
      ],
      edges: [
        { id: 1, from: 1, to: 2, value: '5', color: '#8b7355' },
        { id: 2, from: 2, to: 3, value: '3', color: '#8b7355' }
      ]
    };
    wrapper = mount(JohnsonMin, { props });

    // 2. Lógica de la prueba
    const nodeGroups = wrapper.findAll('.node-group');
    
    // 3. Verificación o Assert
    // Nodo A (fuente): EF = 0
    const nodeA = nodeGroups[0];
    expect(nodeA.text()).toContain('0'); // EF de A
    
    // Nodo B: EF = 5
    const nodeB = nodeGroups[1];
    expect(nodeB.text()).toContain('5'); // EF de B
    
    // Nodo C (sumidero): EF = 8
    const nodeC = nodeGroups[2];
    expect(nodeC.text()).toContain('8'); // EF de C
  });

  /**
   * @Test - PRUEBA 2
   * Verifica que calcule correctamente Late Finish (LF) y holguras en el camino crítico
   * En el camino crítico: holgura = 0
   */
  test('debería calcular holgura cero (h=0) para todos los nodos en el camino crítico', () => {
    // 1. Preparación de la prueba
    const props = {
      ...defaultProps,
      nodes: [
        { id: 1, label: 'A', x: 100, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 2, label: 'B', x: 300, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 3, label: 'C', x: 500, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' }
      ],
      edges: [
        { id: 1, from: 1, to: 2, value: '5', color: '#8b7355' },
        { id: 2, from: 2, to: 3, value: '3', color: '#8b7355' }
      ]
    };
    wrapper = mount(JohnsonMin, { props });

    // 2. Lógica de la prueba
    const nodeGroups = wrapper.findAll('.node-group');
    
    // 3. Verificación o Assert
    // Todos los nodos en un grafo lineal están en el camino crítico
    nodeGroups.forEach(node => {
      expect(node.text()).toContain('h=0'); // Holgura = 0
    });
  });

  /**
   * @Test - PRUEBA 3
   * Verifica que identifique correctamente el camino crítico en un grafo con múltiples caminos
   * Grafo:      B(5) --2--> D(7)
   *           /                \
   *     A(0)                    E(10)
   *           \                /
   *            C(4) --6--> [C->E]
   * Camino crítico: A -> C -> E (duración: 10)
   */
  test('debería identificar correctamente el camino crítico en un grafo con múltiples rutas', () => {
    // 1. Preparación de la prueba
    const props = {
      ...defaultProps,
      nodes: [
        { id: 1, label: 'A', x: 100, y: 200, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 2, label: 'B', x: 300, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 3, label: 'C', x: 300, y: 300, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 4, label: 'D', x: 500, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 5, label: 'E', x: 700, y: 200, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' }
      ],
      edges: [
        { id: 1, from: 1, to: 2, value: '5', color: '#8b7355' },
        { id: 2, from: 1, to: 3, value: '4', color: '#8b7355' },
        { id: 3, from: 2, to: 4, value: '2', color: '#8b7355' },
        { id: 4, from: 3, to: 5, value: '6', color: '#8b7355' },
        { id: 5, from: 4, to: 5, value: '3', color: '#8b7355' }
      ]
    };
    wrapper = mount(JohnsonMin, { props });

    // 2. Lógica de la prueba
    const infoPanel = wrapper.find('.info-panel');
    const infoPanelText = infoPanel.text();

    // 3. Verificación o Assert
    // La duración mínima debe ser 10 (A->C->E: 4+6=10)
    expect(infoPanelText).toContain('10');
    
    // El camino crítico debe contener A, C, y E
    expect(infoPanelText).toContain('A');
    expect(infoPanelText).toContain('C');
    expect(infoPanelText).toContain('E');
  });

  /**
   * @Test - PRUEBA 4
   * Verifica que calcule correctamente la duración mínima del proyecto
   */
  test('debería calcular correctamente la duración mínima del proyecto', () => {
    // 1. Preparación de la prueba
    // Grafo con múltiples caminos:
    // A -> B -> D (5 + 3 = 8)
    // A -> C -> D (2 + 1 = 3)
    // Duración mínima esperada: 3 (camino A->C->D)
    const props = {
      ...defaultProps,
      nodes: [
        { id: 1, label: 'A', x: 100, y: 200, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 2, label: 'B', x: 200, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 3, label: 'C', x: 200, y: 300, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 4, label: 'D', x: 300, y: 200, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' }
      ],
      edges: [
        { id: 'e1', from: 1, to: 2, value: '5', color: '#8b7355' },
        { id: 'e2', from: 1, to: 3, value: '2', color: '#8b7355' },
        { id: 'e3', from: 2, to: 4, value: '3', color: '#8b7355' },
        { id: 'e4', from: 3, to: 4, value: '1', color: '#8b7355' }
      ]
    };
    wrapper = mount(JohnsonMin, { props });

    // 2. Lógica de la prueba
    const infoPanel = wrapper.find('.info-panel');
    const durationText = infoPanel.text();

    // 3. Verificación o Assert
    // La duración mínima debe ser 3 (ruta más corta: A->C->D = 2+1)
    expect(durationText).toContain('Duración mínima del proyecto');
    expect(durationText).toContain('3');
  });

  /**
   * @Test - PRUEBA 5
   * Verifica que maneje correctamente un grafo vacío (sin nodos ni aristas)
   */
  test('debería manejar correctamente un grafo vacío sin nodos ni aristas', () => {
    // 1. Preparación de la prueba
    wrapper = mount(JohnsonMin, { props: defaultProps });

    // 2. Lógica de la prueba
    const modalBody = wrapper.find('.johnson-modal-body');
    const nodeGroups = wrapper.findAll('.node-group');

    // 3. Verificación o Assert
    expect(modalBody.exists()).toBe(true);
    expect(modalBody.text()).toContain('No hay un grafo válido para calcular');
    expect(nodeGroups.length).toBe(0); // No debe haber nodos
  });

  /**
   * @Test - PRUEBA 6
   * Verifica que detecte y advierta sobre grafos con ciclos (no DAG)
   */
  test('debería detectar y advertir cuando el grafo contiene ciclos', () => {
    // 1. Preparación de la prueba - Crear un grafo con ciclo A -> B -> C -> A
    const props = {
      ...defaultProps,
      nodes: [
        { id: 1, label: 'A', x: 100, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 2, label: 'B', x: 300, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 3, label: 'C', x: 500, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' }
      ],
      edges: [
        { id: 1, from: 1, to: 2, value: '5', color: '#8b7355' },
        { id: 2, from: 2, to: 3, value: '3', color: '#8b7355' },
        { id: 3, from: 3, to: 1, value: '2', color: '#8b7355' } // Ciclo
      ]
    };
    wrapper = mount(JohnsonMin, { props });

    // 2. Lógica de la prueba
    const modalBody = wrapper.find('.johnson-modal-body');

    // 3. Verificación o Assert
    expect(modalBody.text()).toContain('No hay un grafo válido para calcular');
  });

  /**
   * @Test - PRUEBA 7
   * Verifica que resalte visualmente las aristas del camino crítico
   */
  test('debería resaltar visualmente las aristas del camino crítico con clase CSS especial', () => {
    // 1. Preparación de la prueba
    const props = {
      ...defaultProps,
      nodes: [
        { id: 1, label: 'A', x: 100, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 2, label: 'B', x: 300, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' },
        { id: 3, label: 'C', x: 500, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' }
      ],
      edges: [
        { id: 1, from: 1, to: 2, value: '5', color: '#8b7355' },
        { id: 2, from: 2, to: 3, value: '3', color: '#8b7355' }
      ]
    };
    wrapper = mount(JohnsonMin, { props });

    // 2. Lógica de la prueba
    const paths = wrapper.findAll('path.min-path');

    // 3. Verificación o Assert
    // En un grafo lineal, todas las aristas son parte del camino crítico
    expect(paths.length).toBeGreaterThan(0);
    
    // Verificar que tengan el estilo correcto
    paths.forEach(path => {
      expect(path.classes()).toContain('min-path');
    });
  });

  /**
   * @Test - PRUEBA 8
   * Verifica que aplique correctamente el tema oscuro/claro
   */
  test('debería aplicar correctamente las clases de tema (light-theme/dark-theme)', () => {
    // 1. Preparación de la prueba - Tema claro
    const propsLight = {
      ...defaultProps,
      theme: 'light-theme',
      nodes: [{ id: 1, label: 'A', x: 100, y: 100, shape: 'circle', color: '#ffffff', borderColor: '#8b7355' }],
      edges: []
    };
    wrapper = mount(JohnsonMin, { props: propsLight });

    // 2. Lógica de la prueba
    const modalContentLight = wrapper.find('.johnson-modal-content');

    // 3. Verificación o Assert - Tema claro
    expect(modalContentLight.classes()).toContain('light-theme');

    // 4. Cambiar a tema oscuro
    wrapper.unmount();
    const propsDark = { ...propsLight, theme: 'dark-theme' };
    wrapper = mount(JohnsonMin, { props: propsDark });
    
    const modalContentDark = wrapper.find('.johnson-modal-content');
    
    // 5. Verificación - Tema oscuro
    expect(modalContentDark.classes()).toContain('dark-theme');
  });

  /**
 * @Test - PRUEBA 9
 * Verifica que los botones de exportar/importar JSON estén presentes
 */
test('debería renderizar los botones de exportar e importar JSON', () => {
  // 1. Preparación de la prueba
  wrapper = mount(JohnsonMin, { props: defaultProps });

  // 2. Lógica de la prueba
  const footerButtons = wrapper.findAll('.footer-btn');
  const buttonTexts = footerButtons.map(btn => btn.text());

  // 3. Verificación o Assert
  expect(buttonTexts.some(text => text.includes('Exportar JSON'))).toBe(true);
  expect(buttonTexts.some(text => text.includes('Importar JSON'))).toBe(true);
  expect(buttonTexts.some(text => text.includes('Eliminar todo y cerrar'))).toBe(true);
  expect(buttonTexts.some(text => text.includes('Cerrar'))).toBe(true);
});

/**
 * @Test - PRUEBA 10
 * Verifica que muestre correctamente el título del modal
 */
test('debería mostrar el título "Algoritmo de Johnson (Minimización)"', () => {
  // 1. Preparación de la prueba
  wrapper = mount(JohnsonMin, { props: defaultProps });

  // 2. Lógica de la prueba
  const header = wrapper.find('.johnson-modal-header');

  // 3. Verificación o Assert
  expect(header.text()).toContain('Algoritmo de Johnson (Minimización)');
}); 

});