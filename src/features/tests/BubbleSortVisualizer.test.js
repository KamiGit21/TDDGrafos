import { describe, test, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import BubbleSortVisualizer from '../Sorts/components/BubbleSortVisualizer.vue';

/**
 * Clase de pruebas para "TDDGrafos\src\features\Sorts\components\BubbleSortVisualizer.vue"
 */
describe('BubbleSortVisualizer', () => {
    let wrapper;

    /**
     * @Test - PRUEBA 1
     */
    test('debería renderizar el componente correctamente', () => {
        // 1. Preparación de la prueba
        wrapper = mount(BubbleSortVisualizer, { props: {} });
        // 2. Lógica de la prueba
        const sortsContainer = wrapper.find('.sorts-container');
        // 3. Verificación o Assert
        expect(sortsContainer.exists()).toBe(true);
    });

    /**
     * @Test - PRUEBA 2
     */
    test('debería mostrar botón de ayuda y abrir el modal al hacer click', async () => {
        // 1. Preparación de la prueba
        wrapper = mount(BubbleSortVisualizer, { props: {} });
        // 2. Lógica de la prueba
        const helpBtn = wrapper.find('.help-button');
        // 3. Verificación o Assert
        expect(helpBtn.exists()).toBe(true);
        await helpBtn.trigger('click');
        expect(wrapper.vm.showHelp).toBe(true);
        expect(wrapper.findComponent({ name: 'Help' }).exists()).toBe(true);
    });

    /**
     * @Test - PRUEBA 3
     */
    test('debería mostrar botones de control y desactivar Desordenar cuando no hay array', () => {
        // 1. Preparación de la prueba
        wrapper = mount(BubbleSortVisualizer, { props: {} });
        // 2. Lógica de la prueba
        const controlBtns = wrapper.findAll('.control-btn');
        const shuffleBtn = wrapper.find('.shuffle-btn');
        // 3. Verificación o Assert
        expect(controlBtns.length).toBeGreaterThanOrEqual(4);
        expect(shuffleBtn.exists()).toBe(true);
        expect(shuffleBtn.attributes('disabled')).toBeDefined();
    });

    /**
     * @Test - PRUEBA 4
     */
    test('resetArray y clearAll funcionan correctamente', () => {
        // 1. Preparación de la prueba
        wrapper = mount(BubbleSortVisualizer, { props: {} });
        // 2. Lógica de la prueba
        wrapper.vm.handleManualInput([5, 4, 3]);
        // 3. Verificación o Assert
        wrapper.vm.resetArray();
        expect(wrapper.vm.sortedArray.length).toBe(0);
        expect(wrapper.vm.displayArray).toEqual(wrapper.vm.originalArray);
        wrapper.vm.clearAll();
        expect(wrapper.vm.originalArray.length).toBe(0);
        expect(wrapper.vm.arrayParams.size).toBe('');
        expect(wrapper.vm.minValue).toBe(0);
        expect(wrapper.vm.maxValue).toBe(0);
    });

    /**
     * @Test - PRUEBA 5
     */
    test('startSort con bubble sort ordena el array (velocidad 0 para tests)', async () => {
        // 1. Preparación de la prueba
        wrapper = mount(BubbleSortVisualizer, { props: {} });
        wrapper.vm.handleManualInput([2, 1]);
        wrapper.vm.animationSpeed = 0;
        wrapper.vm.selectedAlgorithm = 'bubble';
        // 2. Lógica de la prueba
        await wrapper.vm.startSort();
        // 3. Verificación o Assert
        expect(wrapper.vm.sortedArray).toEqual([1, 2]);
        expect(wrapper.vm.isSorting).toBe(false);
    });

});
