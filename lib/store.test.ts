import { beforeEach, describe, expect, it } from '@jest/globals';

import { generateId, useBuilderStore } from './store';
import type { Block, Template } from './types';

describe('useBuilderStore', () => {
  beforeEach(() => {
    // Reset the store before each test
    useBuilderStore.setState({
      blocks: [],
      selectedBlockId: null,
      isDragging: false,
      username: '',
    });
  });

  // TE-ITEM-3.1: addBlock - Append to End
  it('should add block to end when no index provided', () => {
    const initialBlock: Block = {
      id: 'block-1',
      type: 'heading',
      props: { text: 'Test', level: 1, alignment: 'left' },
    };
    const newBlock: Block = {
      id: 'block-2',
      type: 'paragraph',
      props: { text: 'New', alignment: 'left' },
    };

    useBuilderStore.setState({ blocks: [initialBlock] });

    useBuilderStore.getState().addBlock(newBlock);

    const blocks = useBuilderStore.getState().blocks;
    expect(blocks).toHaveLength(2);
    expect(blocks[1].id).toBe('block-2');
    expect(useBuilderStore.getState().selectedBlockId).toBe('block-2');
  });

  // TE-ITEM-3.2: addBlock - Insert at Index
  it('should insert block at specific index', () => {
    const block1: Block = {
      id: 'block-1',
      type: 'heading',
      props: { text: 'Test', level: 1, alignment: 'left' },
    };
    const block2: Block = {
      id: 'block-2',
      type: 'paragraph',
      props: { text: 'Content', alignment: 'left' },
    };
    const blockToInsert: Block = { id: 'block-3', type: 'spacer', props: { height: 20 } };

    useBuilderStore.setState({ blocks: [block1, block2] });

    useBuilderStore.getState().addBlock(blockToInsert, 1);

    const blocks = useBuilderStore.getState().blocks;
    expect(blocks).toHaveLength(3);
    expect(blocks[1].id).toBe('block-3');
  });

  // TE-ITEM-3.3: removeBlock - Removes Block
  it('should remove block by ID', () => {
    const block1: Block = {
      id: 'block-1',
      type: 'heading',
      props: { text: 'Test', level: 1, alignment: 'left' },
    };
    const block2: Block = {
      id: 'block-2',
      type: 'paragraph',
      props: { text: 'Content', alignment: 'left' },
    };

    useBuilderStore.setState({ blocks: [block1, block2], selectedBlockId: 'block-1' });

    useBuilderStore.getState().removeBlock('block-1');

    const blocks = useBuilderStore.getState().blocks;
    expect(blocks).toHaveLength(1);
    expect(blocks[0].id).toBe('block-2');
    expect(useBuilderStore.getState().selectedBlockId).toBeNull();
  });

  // TE-ITEM-3.4: removeBlock - Removes Nested Block
  it('should remove block from nested children', () => {
    const parentBlock: Block = {
      id: 'parent',
      type: 'collapsible',
      props: { title: 'Parent', defaultOpen: true },
      children: [
        { id: 'child-1', type: 'paragraph', props: { text: 'Child 1', alignment: 'left' } },
        { id: 'child-2', type: 'paragraph', props: { text: 'Child 2', alignment: 'left' } },
      ],
    };

    useBuilderStore.setState({ blocks: [parentBlock] });

    useBuilderStore.getState().removeBlock('child-1');

    const blocks = useBuilderStore.getState().blocks;
    expect(blocks[0].children).toHaveLength(1);
    expect(blocks[0].children?.[0].id).toBe('child-2');
  });

  // TE-ITEM-3.5: updateBlock - Updates Props
  it('should update block properties', () => {
    const block: Block = {
      id: 'block-1',
      type: 'heading',
      props: { text: 'Old', level: 1, alignment: 'left' },
    };

    useBuilderStore.setState({ blocks: [block] });

    useBuilderStore.getState().updateBlock('block-1', { text: 'New' });

    const updatedBlock = useBuilderStore.getState().blocks[0];
    expect(updatedBlock.props.text).toBe('New');
    expect(updatedBlock.props.level).toBe(1); // Existing preserved
  });

  // TE-ITEM-3.6: updateBlock - Updates Nested Block
  it('should update nested block props', () => {
    const parentBlock: Block = {
      id: 'parent',
      type: 'collapsible',
      props: { title: 'Parent', defaultOpen: true },
      children: [{ id: 'child-1', type: 'paragraph', props: { text: 'Old', alignment: 'left' } }],
    };

    useBuilderStore.setState({ blocks: [parentBlock] });

    useBuilderStore.getState().updateBlock('child-1', { text: 'New' });

    const child = useBuilderStore.getState().blocks[0].children?.[0];
    expect(child?.props.text).toBe('New');
  });

  // TE-ITEM-3.7: moveBlock - Reorders Blocks
  it('should move block from one index to another', () => {
    const blocks: Block[] = [
      { id: 'block-1', type: 'heading', props: { text: '1', level: 1, alignment: 'left' } },
      { id: 'block-2', type: 'paragraph', props: { text: '2', alignment: 'left' } },
      { id: 'block-3', type: 'spacer', props: { height: 20 } },
    ];

    useBuilderStore.setState({ blocks });

    useBuilderStore.getState().moveBlock(0, 2);

    const reordered = useBuilderStore.getState().blocks;
    expect(reordered[0].id).toBe('block-2');
    expect(reordered[1].id).toBe('block-3');
    expect(reordered[2].id).toBe('block-1');
  });

  // TE-ITEM-3.8: selectBlock - Sets Selection
  it('should set selectedBlockId', () => {
    useBuilderStore.setState({ blocks: [] });

    useBuilderStore.getState().selectBlock('block-1');

    expect(useBuilderStore.getState().selectedBlockId).toBe('block-1');
  });

  // TE-ITEM-3.9: selectBlock - Clears Selection
  it('should clear selection with null', () => {
    useBuilderStore.setState({ selectedBlockId: 'block-1' });

    useBuilderStore.getState().selectBlock(null);

    expect(useBuilderStore.getState().selectedBlockId).toBeNull();
  });

  // TE-ITEM-3.10: setBlocks - Replaces All Blocks
  it('should replace all blocks', () => {
    const existingBlocks: Block[] = [
      { id: 'old', type: 'heading', props: { text: 'Old', level: 1, alignment: 'left' } },
    ];
    const newBlocks: Block[] = [
      { id: 'new-1', type: 'paragraph', props: { text: 'New 1', alignment: 'left' } },
      { id: 'new-2', type: 'paragraph', props: { text: 'New 2', alignment: 'left' } },
    ];

    useBuilderStore.setState({ blocks: existingBlocks });

    useBuilderStore.getState().setBlocks(newBlocks);

    const blocks = useBuilderStore.getState().blocks;
    expect(blocks).toHaveLength(2);
    expect(blocks[0].id).toBe('new-1');
  });

  // TE-ITEM-3.11: duplicateBlock - Duplicates Block
  it('should create copy of block with new ID', () => {
    const block: Block = {
      id: 'block-1',
      type: 'heading',
      props: { text: 'Test', level: 1, alignment: 'left' },
    };

    useBuilderStore.setState({ blocks: [block] });

    useBuilderStore.getState().duplicateBlock('block-1');

    const blocks = useBuilderStore.getState().blocks;
    expect(blocks).toHaveLength(2);
    expect(blocks[0].id).toBe('block-1');
    expect(blocks[1].id).not.toBe('block-1');
    expect(blocks[1].props.text).toBe('Test');
  });

  // TE-ITEM-3.12: clearBlocks - Removes All
  it('should remove all blocks', () => {
    const blocks: Block[] = [
      { id: 'block-1', type: 'heading', props: { text: 'Test', level: 1, alignment: 'left' } },
      { id: 'block-2', type: 'paragraph', props: { text: 'Content', alignment: 'left' } },
    ];

    useBuilderStore.setState({ blocks });

    useBuilderStore.getState().clearBlocks();

    expect(useBuilderStore.getState().blocks).toHaveLength(0);
  });

  // TE-ITEM-3.13: loadTemplate - Loads Template Blocks
  it('should load template blocks', () => {
    const template: Template = {
      id: 'template-1',
      name: 'Test Template',
      description: 'A test template',
      thumbnail: '/test.png',
      blocks: [
        {
          id: 'template-block-1',
          type: 'heading',
          props: { text: 'From Template', level: 1, alignment: 'left' },
        },
      ],
    };

    useBuilderStore.setState({ blocks: [] });

    useBuilderStore.getState().loadTemplate(template);

    const blocks = useBuilderStore.getState().blocks;
    expect(blocks).toHaveLength(1);
    expect(blocks[0].props.text).toBe('From Template');
  });

  // TE-ITEM-3.14: addChildBlock - Adds to Parent
  it('should add child block to parent', () => {
    const parentBlock: Block = {
      id: 'parent',
      type: 'collapsible',
      props: { title: 'Parent', defaultOpen: true },
      children: [],
    };
    const childBlock: Block = {
      id: 'child',
      type: 'paragraph',
      props: { text: 'Child', alignment: 'left' },
    };

    useBuilderStore.setState({ blocks: [parentBlock] });

    useBuilderStore.getState().addChildBlock('parent', childBlock);

    const blocks = useBuilderStore.getState().blocks;
    expect(blocks[0].children).toHaveLength(1);
    expect(blocks[0].children?.[0].props.text).toBe('Child');
  });

  // TE-ITEM-3.15: generateId - Unique IDs
  it('should generate unique IDs', () => {
    const ids = new Set<string>();

    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }

    expect(ids.size).toBe(100); // All IDs should be unique
  });
});
