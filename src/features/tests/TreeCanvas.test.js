import { describe, test, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import TreeCanvas from '../Trees/components/TreeCanvas.vue';
/**
 * Clase de pruebas para "src\features\Trees\components\TreeCanvas.vue"
 */
const makeTree = (opts = {}) => {
    // Simula un árbol binario simple con posiciones calculadas
    return {
        root: { id: 1, value: 'A', x: 100, y: 100, left: { id: 2, value: 'B', x: 50, y: 200 }, right: { id: 3, value: 'C', x: 150, y: 200 } },
        nodeCount: 3,
        calculatePositions: () => ({
            positions: {
                1: { id: 1, value: 'A', x: 100, y: 100 },
                2: { id: 2, value: 'B', x: 50, y: 200 },
                3: { id: 3, value: 'C', x: 150, y: 200 }
            },
            bounds: { minX: 0, maxX: 200, minY: 0, maxY: 300 }
        }),
        ...opts
    };
};

describe('TreeCanvas', () => {
    // 1. Preparación de la prueba
    let wrapper;
    let defaultProps;

    beforeEach(() => {
        defaultProps = { tree: null, highlightedNodes: [] };
    });

    /**
   * @Test - PRUEBA 1
   */
    test('debería renderizar el componente correctamente', () => {
        // 1. Preparación de la prueba
        wrapper = mount(TreeCanvas, { props: defaultProps });
        // 2. Lógica de la prueba
        const canvaContainer = wrapper.find('.tree-canvas-container');
        // 3. Verificación o Assert
        expect(canvaContainer.exists()).toBe(true);
    });

    /**
   * @Test - PRUEBA 2
   */
    test('debería mostrar estado vacío cuando no hay árbol', () => {
        // 1. Preparación de la prueba
        wrapper = mount(TreeCanvas, { props: defaultProps });
        // 2. Lógica de la prueba
        const emptyState = wrapper.find('.empty-state');
        // 3. Verificación o Assert
        expect(emptyState.exists()).toBe(true);
        expect(emptyState.text()).toContain('El árbol está vacío');
    });

    /**
   * @Test - PRUEBA 3
   */
    test('debería renderizar nodos correctamente cuando hay árbol', () => {
        // 1. Preparación de la prueba
        wrapper = mount(TreeCanvas, { props: { tree: makeTree() } });
        // 2. Lógica de la prueba
        const nodes = wrapper.findAll('.tree-node');
        // 3. Verificación o Assert
        expect(nodes.length).toBe(3);
        expect(nodes[0].find('.node-text').text()).toBe('A');
    });

    /**
   * @Test - PRUEBA 4
   */
    test('debería renderizar líneas de conexión entre nodos', () => {
        // 1. Preparación de la prueba
        wrapper = mount(TreeCanvas, { props: { tree: makeTree() } });
        // 2. Lógica de la prueba
        const lines = wrapper.findAll('.connection-line');
        // 3. Verificación o Assert
        expect(lines.length).toBe(2); // A-B y A-C
    });

    /**
   * @Test - PRUEBA 5
   */
    test('debería mostrar controles de zoom y ajuste', () => {
        // 1. Preparación de la prueba
        wrapper = mount(TreeCanvas, { props: defaultProps });
        // 2. Lógica de la prueba
        const controls = wrapper.findAll('.control-btn');
        // 3. Verificación o Assert
        expect(controls.length).toBeGreaterThanOrEqual(4);
    });

    /**
   * @Test - PRUEBA 6
   */
    test('debería mostrar el porcentaje de zoom', () => {
        // 1. Preparación de la prueba
        wrapper = mount(TreeCanvas, { props: defaultProps });
        // 2. Lógica de la prueba
        const zoomInfo = wrapper.find('.zoom-info');
        // 3. Verificación o Assert
        expect(zoomInfo.exists()).toBe(true);
        expect(zoomInfo.text()).toContain('%');
    });

    /**
   * @Test - PRUEBA 7
   */
    test('debería acercar el zoom al hacer click en el botón +', async () => {
        // 1. Preparación de la prueba
        wrapper = mount(TreeCanvas, { props: { tree: makeTree() } });
        // 2. Lógica de la prueba
        const zoomBtn = wrapper.findAll('.control-btn')[0];
        const prevScale = wrapper.vm.scale;
        await zoomBtn.trigger('click');
        // 3. Verificación o Assert
        expect(wrapper.vm.scale).toBeGreaterThan(prevScale);
    });

    /**
   * @Test - PRUEBA 8
   */
    test('debería alejar el zoom al hacer click en el botón −', async () => {
        // 1. Preparación de la prueba
        wrapper = mount(TreeCanvas, { props: { tree: makeTree() } });
        // 2. Lógica de la prueba
        const zoomOutBtn = wrapper.findAll('.control-btn')[1];
        wrapper.vm.scale = 2;
        await zoomOutBtn.trigger('click');
        // 3. Verificación o Assert
        expect(wrapper.vm.scale).toBeLessThan(2);
    });

    /**
   * @Test - PRUEBA 9
   */
    test('debería ajustar el árbol al hacer click en el botón de ajuste', async () => {
        // 1. Preparación de la prueba
        wrapper = mount(TreeCanvas, { props: { tree: makeTree() } });
        // 2. Lógica de la prueba
        const fitBtn = wrapper.findAll('.control-btn')[2];
        wrapper.vm.scale = 0.5;
        await fitBtn.trigger('click');
        // 3. Verificación o Assert
        expect(wrapper.vm.scale).toBeGreaterThan(0.5);
    });

    /**
   * @Test - PRUEBA 10
   */
    test('debería resaltar nodos si están en highlightedNodes', () => {
        // 1. Preparación de la prueba
        wrapper = mount(TreeCanvas, { props: { tree: makeTree(), highlightedNodes: [2] } });
        // 2. Lógica de la prueba
        const highlighted = wrapper.findAll('.tree-node.highlighted');
        // 3. Verificación o Assert
        expect(highlighted.length).toBe(1);
        expect(highlighted[0].find('.node-text').text()).toBe('B');
    });
});
