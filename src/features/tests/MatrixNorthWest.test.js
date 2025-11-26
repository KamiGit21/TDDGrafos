import { describe, expect, beforeEach, test } from 'vitest';
import { mount } from '@vue/test-utils';
import MatrixNorthWest from '../NorthWest/components/MatrixNorthWest.vue';
/**
 * Clase de pruebas para "src\features\NorthWest\components\MatrixNorthWest.vue"
 */
describe('MatrixNorthWest', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            sources: [],
            destinations: [],
            supply: [],
            demand: [],
            costs: [],
            theme: 'light-theme'
        };
    });

    /**
       * @Test - PRUEBA 1
       */
    test('debería renderizar el componente correctamente', () => {
        // 1. Preparación de la prueba
        wrapper = mount(MatrixNorthWest, { props: defaultProps });
        // 2. Lógica de la prueba
        const editor = wrapper.find('.matrix-editor');
        // 3. Verificación o Assert
        expect(editor.exists()).toBe(true);
    });
    /**
       * @Test - PRUEBA 2
       */
    test('debería mostrar la tabla de transporte incluso con datos vacíos', () => {
        // 1. Preparación de la prueba
        wrapper = mount(MatrixNorthWest, { props: defaultProps });
        // 2. Lógica de la prueba
        const table = wrapper.find('.transport-table');
        // 3. Verificación o Assert
        expect(table.exists()).toBe(true);
    });
    /**
       * @Test - PRUEBA 3
       */
    test('debería renderizar la matriz correctamente con datos', () => {
        // 1. Preparación de la prueba
        const propsWithMatrix = {
            sources: ['A', 'B'],
            destinations: ['1', '2'],
            supply: [10, 20],
            demand: [15, 15],
            costs: [[5, 10], [15, 20]],
            theme: 'light-theme'
        };
        wrapper = mount(MatrixNorthWest, { props: propsWithMatrix });
        // 2. Lógica de la prueba
        const costCells = wrapper.findAll('.cost-cell');
        // 3. Verificación o Assert
        expect(costCells.length).toBe(4); // 2x2
    });

    /**
   * @Test - PRUEBA 4
   */
    test('debería mostrar totales y formatearlos con dos decimales', () => {
        // 1. Preparación de la prueba
        const props = {
            sources: ['A', 'B'],
            destinations: ['1'],
            supply: [10, 5],
            demand: [7, 8],
            costs: [[1], [2]],
            theme: 'light-theme'
        };
        wrapper = mount(MatrixNorthWest, { props });
        // 2. Lógica de la prueba
        const ofertaLabel = wrapper.findAll('.total-label')[0];
        const demandaLabel = wrapper.findAll('.total-label')[1];
        // 3. Verificación o Assert
        expect(ofertaLabel.text()).toContain('Oferta:');
        expect(ofertaLabel.text()).toContain('15.00');
        expect(demandaLabel.text()).toContain('Demanda:');
        expect(demandaLabel.text()).toContain('15.00');
    });

    /**
   * @Test - PRUEBA 5
   */
    test('debería indicar balance cuando oferta y demanda son iguales', () => {
        // 1. Preparación de la prueba
        const props = {
            sources: ['A'],
            destinations: ['1'],
            supply: [10],
            demand: [10],
            costs: [[0]],
            theme: 'light-theme'
        };
        wrapper = mount(MatrixNorthWest, { props });
        // 2. Lógica de la prueba
        const indicator = wrapper.find('.balance-indicator');
        // 3. Verificación o Assert
        expect(indicator.exists()).toBe(true);
        expect(indicator.classes()).toContain('balanced');
        expect(indicator.text()).toContain('Balanceado');
    });

    /**
   * @Test - PRUEBA 6
   */
    test('debería emitir eventos al añadir origen y destino', async () => {
        // 1. Preparación de la prueba
        wrapper = mount(MatrixNorthWest, { props: defaultProps });
        // 2. Lógica de la prueba
        const addButtons = wrapper.findAll('.btn-add');
        await addButtons[0].trigger('click'); // Origen
        await addButtons[1].trigger('click'); // Destino
        // 3. Verificación o Assert
        expect(wrapper.emitted()).toHaveProperty('add-source');
        expect(wrapper.emitted()).toHaveProperty('add-destination');
    });

    /**
   * @Test - PRUEBA 7
   */
    test('debería emitir update-cost al cambiar un costo', async () => {
        // 1. Preparación de la prueba
        const props = {
            sources: ['A'],
            destinations: ['1'],
            supply: [5],
            demand: [5],
            costs: [[5]],
            theme: 'light-theme'
        };
        wrapper = mount(MatrixNorthWest, { props });
        // 2. Lógica de la prueba
        const costInput = wrapper.find('.cost-input');
        await costInput.setValue('10');
        // 3. Verificación o Assert
        expect(wrapper.emitted()['update-cost']).toBeTruthy();
        expect(wrapper.emitted()['update-cost'][0]).toEqual([0, 0, 10]);
    });

    /**
   * @Test - PRUEBA 8
   */
    test('debería emitir remove-source y remove-destination al pulsar botones eliminar', async () => {
        // 1. Preparación de la prueba
        const props = {
            sources: ['A', 'B'],
            destinations: ['1', '2'],
            supply: [5, 5],
            demand: [5, 5],
            costs: [[1, 2], [3, 4]],
            theme: 'light-theme'
        };
        wrapper = mount(MatrixNorthWest, { props });
        // 2. Lógica de la prueba
        // eliminar un origen (botón dentro de la fila de origen)
        const firstSourceRow = wrapper.findAll('tbody tr')[0];
        const sourceRemove = firstSourceRow.find('.btn-remove');
        await sourceRemove.trigger('click');
        expect(wrapper.emitted()).toHaveProperty('remove-source');

        // eliminar un destino (botón dentro del header de destinos)
        const destHeaderRemove = wrapper.findAll('thead .btn-remove')[0];
        await destHeaderRemove.trigger('click');
        // 3. Verificación o Assert
        expect(wrapper.emitted()).toHaveProperty('remove-destination');
    });

    /**
   * @Test - PRUEBA 9
   */
    test('los inputs deben reflejar los valores iniciales de costos', () => {
        // 1. Preparación de la prueba
        const props = {
            sources: ['A'],
            destinations: ['1'],
            supply: [5],
            demand: [5],
            costs: [[7]],
            theme: 'light-theme'
        };
        wrapper = mount(MatrixNorthWest, { props });
        // 2. Lógica de la prueba
        const costInput = wrapper.find('.cost-input');
        // 3. Verificación o Assert
        expect(costInput.element.value).toBe('7');
    });

    /**
 * @Test - PRUEBA 10
 */
    test('debería aplicar correctamente el tema (claro/oscuro) recibida por props', () => {
        // 1. Preparación de la prueba
        const props = {
            ...defaultProps,
            theme: 'dark-theme'
        };
        wrapper = mount(MatrixNorthWest, { props });
        // 2. Lógica de la prueba
        const root = wrapper.find('.matrix-editor');
        // 3. Verificación o Assert
        expect(root.classes()).toContain('dark-theme');
    });

});


