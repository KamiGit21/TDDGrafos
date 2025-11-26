import { describe, it, expect, beforeEach, test } from 'vitest';
import { mount } from '@vue/test-utils';
import AssignmentMatrix from '../Asignacion/components/AssignmentMatrix.vue';
/**
 * Clase de pruebas para AssignmentMatrix
 */
describe('AssignmentMatrix', () => {
  let wrapper;
  let defaultProps;

  beforeEach(() => {
    defaultProps = {
      nodes: [],
      assignmentMatrix: [],
      hungarianResult: {
        iterations: [],
        assignments: [],
        totalCost: 0,
        sources: [],
        destinations: []
      },
      optimizationMode: 'minimize',
      currentTheme: 'light-theme'
    };
  });

/**
   * @Test - PRUEBA 1
   */
  test('debería renderizar el componente correctamente', () => {
    // 1. Preparación de la prueba
    wrapper = mount(AssignmentMatrix, { props: defaultProps });

    // 2. Lógica de la prueba
    const modal = wrapper.find('.matrix-modal-overlay');

    // 3. Verificación o Assert
    expect(modal.exists()).toBe(true);
  });

  /**
   * @Test - PRUEBA 2
   */
  test('debería mostrar estado vacío cuando no hay datos', () => {
    // 1. Preparación de la prueba
    wrapper = mount(AssignmentMatrix, { props: defaultProps });

    // 2. Lógica de la prueba
    const emptyState = wrapper.find('.empty-state');

    // 3. Verificación o Assert
    expect(emptyState.exists()).toBe(true);
    expect(emptyState.text()).toContain('No hay datos para resolver el problema de asignación');
  });

  /**
   * @Test - PRUEBA 3
   */
  test('debería renderizar la matriz correctamente con datos', () => {
    // 1. Preparación de la prueba
    const propsWithMatrix = {
      ...defaultProps,
      hungarianResult: {
        ...defaultProps.hungarianResult,
        sources: ['A', 'B'],
        destinations: ['1', '2'],
        iterations: [{
          matrix: [[5, 10], [15, 20]],
          step: 'Matriz Inicial',
          description: 'Matriz de costos original',
          sources: ['A', 'B'],
          destinations: ['1', '2']
        }]
      }
    };
    wrapper = mount(AssignmentMatrix, { props: propsWithMatrix });

    // 2. Lógica de la prueba
    const table = wrapper.find('.matrix-table');
    const cells = wrapper.findAll('.matrix-cell');

    // 3. Verificación o Assert
    expect(table.exists()).toBe(true);
    // Equivalente a: assertEquals(4, cells.length);
    expect(cells.length).toBe(4); // 2x2 matriz
  });

  /**
   * @Test - PRUEBA 4
   */
  test('debería formatear valores infinitos correctamente', () => {
    // 1. Preparación de la prueba
    const propsWithInfinity = {
      ...defaultProps,
      hungarianResult: {
        ...defaultProps.hungarianResult,
        sources: ['A'],
        destinations: ['1'],
        iterations: [{
          matrix: [[999999]],
          step: 'Con infinito',
          sources: ['A'],
          destinations: ['1']
        }]
      }
    };
    wrapper = mount(AssignmentMatrix, { props: propsWithInfinity });

    // 2. Lógica de la prueba
    const cell = wrapper.find('.weight-value');

    // 3. Verificación o Assert
    expect(cell.text()).toBe('∞');
  });

  /**
   * @Test - PRUEBA 5
   */
  test('debería iniciar en la última iteración', async () => {
    // 1. Preparación de la prueba
    const propsWithIterations = {
      ...defaultProps,
      hungarianResult: {
        ...defaultProps.hungarianResult,
        sources: ['A'],
        destinations: ['1'],
        iterations: [
          { matrix: [[1]], step: 'Paso 1', sources: ['A'], destinations: ['1'] },
          { matrix: [[2]], step: 'Paso 2', sources: ['A'], destinations: ['1'] },
          { matrix: [[3]], step: 'Paso 3', sources: ['A'], destinations: ['1'] }
        ]
      }
    };
    wrapper = mount(AssignmentMatrix, { props: propsWithIterations });
    await wrapper.vm.$nextTick();

    // 2. Lógica de la prueba
    const counter = wrapper.find('.iteration-counter');

    // 3. Verificación o Assert
  
    expect(counter.text()).toContain('Paso 3 / 3');
  });

  /**
   * @Test - PRUEBA 6
   */
  test('debería navegar entre iteraciones correctamente', async () => {
    // 1. Preparación de la prueba
    const propsWithIterations = {
      ...defaultProps,
      hungarianResult: {
        ...defaultProps.hungarianResult,
        sources: ['A'],
        destinations: ['1'],
        iterations: [
          { matrix: [[1]], step: 'Paso 1', sources: ['A'], destinations: ['1'] },
          { matrix: [[2]], step: 'Paso 2', sources: ['A'], destinations: ['1'] },
          { matrix: [[3]], step: 'Paso 3', sources: ['A'], destinations: ['1'] }
        ]
      }
    };
    wrapper = mount(AssignmentMatrix, { props: propsWithIterations });
    await wrapper.vm.$nextTick();

    // 2. Lógica de la prueba
    const prevButton = wrapper.findAll('.iteration-button')[0];
    await prevButton.trigger('click');
    await wrapper.vm.$nextTick();
    const counter = wrapper.find('.iteration-counter');
    // 3. Verificación o Assert
    expect(counter.text()).toContain('Paso 2 / 3');
  });

  /**
   * @Test - PRUEBA 7
   */
  test('debería mostrar la solución óptima en la última iteración', async () => {
    // 1. Preparación de la prueba
    const propsWithSolution = {
      ...defaultProps,
      hungarianResult: {
        sources: ['A', 'B'],
        destinations: ['1', '2'],
        iterations: [
          { matrix: [[1, 2], [3, 4]], step: 'Final', sources: ['A', 'B'], destinations: ['1', '2'] }
        ],
        assignments: [
          { fromLabel: 'A', toLabel: '1', cost: 5 },
          { fromLabel: 'B', toLabel: '2', cost: 10 }
        ],
        totalCost: 15
      }
    };
    wrapper = mount(AssignmentMatrix, { props: propsWithSolution });
    await wrapper.vm.$nextTick();

    // 2. Lógica de la prueba
    const solution = wrapper.find('.solution-section');
    const totalCost = wrapper.find('.cost-value');
    const assignmentItems = wrapper.findAll('.assignment-item');

    // 3. Verificación o Assert
    expect(solution.exists()).toBe(true);
    expect(totalCost.text()).toBe('15');
    expect(assignmentItems.length).toBe(2);
  });

  /**
   * @Test - PRUEBA 8
   */
  test('debería emitir evento close al hacer clic en botón cerrar', async () => {
    // 1. Preparación de la prueba
    wrapper = mount(AssignmentMatrix, { props: defaultProps });

    // 2. Lógica de la prueba
    const closeButton = wrapper.find('.close-button');
    await closeButton.trigger('click');

    // 3. Verificación o Assert
    expect(wrapper.emitted()).toHaveProperty('close');
    expect(wrapper.emitted().close.length).toBe(1);
  });

  /**
   * @Test - PRUEBA 9
   */
  test('debería aplicar clase assignment-cell a celdas asignadas', async () => {
    // 1. Preparación de la prueba
    const propsWithAssignment = {
      ...defaultProps,
      hungarianResult: {
        sources: ['A'],
        destinations: ['1'],
        iterations: [{
          matrix: [[5]],
          step: 'Con asignación',
          assignments: [{ row: 0, col: 0 }],
          sources: ['A'],
          destinations: ['1']
        }]
      }
    };
    wrapper = mount(AssignmentMatrix, { props: propsWithAssignment });
    await wrapper.vm.$nextTick();

    // 2. Lógica de la prueba
    const cell = wrapper.find('.matrix-cell');

    // 3. Verificación o Assert
    expect(cell.classes()).toContain('assignment-cell');
  });

  /**
   * @Test - PRUEBA 10
   */
  test('hasData debería retornar true cuando hay iteraciones', () => {
    // 1. Preparación de la prueba
    const propsWithData = {
      ...defaultProps,
      hungarianResult: {
        ...defaultProps.hungarianResult,
        iterations: [{ matrix: [[1]], sources: ['A'], destinations: ['1'] }]
      }
    };
    wrapper = mount(AssignmentMatrix, { props: propsWithData });

    // 2. Lógica de la prueba
    const hasData = wrapper.vm.hasData;

    // 3. Verificación o Assert
    expect(hasData).toBe(true);
  });
});


