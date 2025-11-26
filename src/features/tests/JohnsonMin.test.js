import { describe, it, expect, beforeEach, test } from 'vitest';
import { mount } from '@vue/test-utils';
import JohnsonMin from '../Johnson/components/JohnsonMin.vue';

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
});
