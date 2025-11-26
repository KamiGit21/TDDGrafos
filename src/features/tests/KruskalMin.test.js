import { describe, test, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import KruskalMin from '../Kruskal/components/KruskalMin.vue';

/**
 * Clase de pruebas para KruskalMin
 */
describe('KruskalMin', () => {
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = {
            nodes: [],
            edges: [],
            theme: 'light-theme'
        };
    });

    /**
     * @Test - PRUEBA 1
     */
    test('debería renderizar el componente correctamente', () => {
        // 1. Preparación de la prueba
        wrapper = mount(KruskalMin, { props: defaultProps });
        // 2. Lógica de la prueba
        const modal = wrapper.find('.kruskal-modal-overlay');
        // 3. Verificación o Assert
        expect(modal.exists()).toBe(true);
    });

    /**
     * @Test - PRUEBA 2
     */
    test('debería mostrar estado vacío cuando no hay nodos ni aristas', () => {
        // 1. Preparación de la prueba
        wrapper = mount(KruskalMin, { props: defaultProps });
        // 2. Lógica de la prueba
        const emptyMessage = wrapper.find('.kruskal-modal-body p');
        // 3. Verificación o Assert
        expect(emptyMessage.exists()).toBe(true);
        expect(emptyMessage.text()).toContain('El grafo está vacío');
    });

    /**
     * @Test - PRUEBA 3
     */
    test('debería renderizar nodos correctamente con datos', () => {
        // 1. Preparación de la prueba
        const propsWithNodes = {
            ...defaultProps,
            nodes: [
                { id: 1, label: 'A', x: 100, y: 100, color: '#4FD1C5', borderColor: '#2D3748', isInMST: false },
                { id: 2, label: 'B', x: 200, y: 100, color: '#4FD1C5', borderColor: '#2D3748', isInMST: false }
            ],
            edges: [
                { id: 1, source: 1, target: 2, weight: 5 }
            ]
        };
        wrapper = mount(KruskalMin, { props: propsWithNodes });
        // 2. Lógica de la prueba
        const nodes = wrapper.findAll('.node-label');
        // 3. Verificación o Assert
        expect(nodes.length).toBe(2);
        expect(nodes[0].text()).toBe('A');
        expect(nodes[1].text()).toBe('B');
    });

    /**
     * @Test - PRUEBA 4
     */
    test('debería mostrar el peso total del árbol mínimo', () => {
        // 1. Preparación de la prueba
        const propsWithMST = {
            ...defaultProps,
            nodes: [
                { id: 1, label: 'A', x: 100, y: 100, color: '#4FD1C5', borderColor: '#2D3748', isInMST: true },
                { id: 2, label: 'B', x: 200, y: 100, color: '#4FD1C5', borderColor: '#2D3748', isInMST: true }
            ],
            edges: [
                { id: 1, source: 1, target: 2, weight: 10, isInMST: true }
            ]
        };
        wrapper = mount(KruskalMin, { props: propsWithMST });
        // 2. Lógica de la prueba
        const infoPanel = wrapper.find('.info-panel p');
        // 3. Verificación o Assert
        expect(infoPanel.exists()).toBe(true);
        expect(infoPanel.text()).toContain('Peso total del árbol mínimo:');
    });

    /**
     * @Test - PRUEBA 5
     */
    test('debería emitir evento close al hacer clic en botón cerrar', async () => {
        // 1. Preparación de la prueba
        wrapper = mount(KruskalMin, { props: defaultProps });
        // 2. Lógica de la prueba
        const closeButton = wrapper.find('.close-button');
        await closeButton.trigger('click');
        // 3. Verificación o Assert
        expect(wrapper.emitted()).toHaveProperty('close');
        expect(wrapper.emitted().close.length).toBe(1);
    });
});
