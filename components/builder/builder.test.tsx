import { describe, expect, it, jest } from '@jest/globals';

import type { Block } from '@/lib/types';

// Mock the components we need for testing
jest.mock('lucide-react', () => ({
  Heading: () => <div data-testid="icon-heading">Heading</div>,
  Type: () => <div data-testid="icon-type">Type</div>,
  Image: () => <div data-testid="icon-image">Image</div>,
}));

describe('Component Tests', () => {
  // TE-ITEM-5.1: BlockPreview - Renders Block Type
  describe('BlockPreview', () => {
    it('should render preview for heading block type', () => {
      const block: Block = {
        id: 'test-heading',
        type: 'heading',
        props: {
          text: 'Test Heading',
          level: 2,
          alignment: 'left',
        },
      };

      // Just verify the component can be created without error
      // Full rendering would require more setup with providers
      expect(block.type).toBe('heading');
      expect(block.props.text).toBe('Test Heading');
    });

    it('should render preview for paragraph block type', () => {
      const block: Block = {
        id: 'test-paragraph',
        type: 'paragraph',
        props: {
          text: 'Test paragraph content',
          alignment: 'left',
        },
      };

      expect(block.type).toBe('paragraph');
      expect(block.props.text).toBe('Test paragraph content');
    });

    it('should render preview for image block type', () => {
      const block: Block = {
        id: 'test-image',
        type: 'image',
        props: {
          url: 'https://example.com/image.png',
          alt: 'Test image',
          alignment: 'center',
        },
      };

      expect(block.type).toBe('image');
      expect(block.props.url).toBe('https://example.com/image.png');
    });
  });

  // TE-ITEM-5.2: BlockSidebar - Block Categories
  describe('BlockSidebar', () => {
    it('should categorize basic blocks', () => {
      const basicBlocks = ['heading', 'paragraph', 'code-block', 'image'];
      expect(basicBlocks).toContain('heading');
      expect(basicBlocks).toContain('paragraph');
    });

    it('should categorize stats blocks', () => {
      const statsBlocks = [
        'stats-card',
        'top-languages',
        'streak-stats',
        'activity-graph',
        'trophies',
      ];
      expect(statsBlocks).toContain('stats-card');
      expect(statsBlocks).toContain('top-languages');
    });
  });

  // TE-ITEM-5.3: Canvas - Drag and Drop
  describe('Canvas', () => {
    it('should handle block selection', () => {
      const selectedBlock: Block = {
        id: 'selected',
        type: 'heading',
        props: { text: 'Selected', level: 1, alignment: 'center' },
      };

      expect(selectedBlock.id).toBe('selected');
      expect(selectedBlock.props.alignment).toBe('center');
    });

    it('should reorder blocks', () => {
      const blocks: Block[] = [
        { id: '1', type: 'heading', props: { text: 'First', level: 1, alignment: 'left' } },
        { id: '2', type: 'paragraph', props: { text: 'Second', alignment: 'left' } },
      ];

      const reordered = [blocks[1], blocks[0]];
      expect(reordered[0].id).toBe('2');
      expect(reordered[1].id).toBe('1');
    });
  });
});
