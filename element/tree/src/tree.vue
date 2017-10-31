<template>
  <div class="el-tree" :class="{ 'el-tree--highlight-current': highlightCurrent }">
    <el-tree-node
      v-for="child in root.childNodes"
      :node="child"
      :props="props"
      :key="getNodeKey(child)"
      :render-content="renderContent"
      @node-expand="handleNodeExpand">
    </el-tree-node>
    <div class="el-tree__empty-block" v-if="!root.childNodes || root.childNodes.length === 0">
      <span class="el-tree__empty-text">{{ emptyText }}</span>
    </div>
  </div>
</template>

<script>
  import TreeStore from './model/tree-store';
  import ElTreeNode from './tree-node.vue';
  import {t} from 'element-ui/src/locale';
  import emitter from 'element-ui/src/mixins/emitter';

  export default {
    name: 'ElTree',

    mixins: [emitter],

    components: {
      ElTreeNode
    },

    data() {
      return {
        store: null,
        root: null,
        currentNode: null
      };
    },

    props: {
        /* 展示数据 */
      data: {
        type: Array
      },
        /* 内容为空的时候展示的文本 */
      emptyText: {
        type: String,
        default() {
          return t('el.tree.emptyText');
        }
      },
        /* 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 */
      nodeKey: String,
        /* 在显示复选框的情况下，是否严格的遵循父子不互相关联的做法，默认为 false */
      checkStrictly: Boolean,
        /* 是否默认展开所有节点 */
      defaultExpandAll: Boolean,
        /*是否在点击节点的时候展开或者收缩节点， 默认值为 true，如果为 false，则只有点箭头图标的时候才会展开或者收缩节点。*/
      expandOnClickNode: {
        type: Boolean,
        default: true
      },
      checkDescendants: {
        type: Boolean,
        default: false
      },
        /* 展开子节点的时候是否自动展开父节点 */
      autoExpandParent: {
        type: Boolean,
        default: true
      },
        /* 默认勾选的节点的 key 的数组 */
      defaultCheckedKeys: Array,
        /* 默认展开的节点的 key 的数组 */
      defaultExpandedKeys: Array,
        /* 树节点的内容区的渲染 Function */
      renderContent: Function,
        /* 节点是否可被选择 */
      showCheckbox: {
        type: Boolean,
        default: false
      },
      props: {
        default() {
          return {
              /* 指定子树为节点对象的某个属性值 */
            children: 'children',
              /* 指定节点标签为节点对象的某个属性值 */
            label: 'label',
            icon: 'icon',
            disabled: 'disabled'
          };
        }
      },
      lazy: {
        type: Boolean,
        default: false
      },
        /* 是否高亮当前选中节点，默认值是 false */
      highlightCurrent: Boolean,
        /* 加载子树数据的方法 */
      load: Function,
        /* 对树节点进行筛选时执行的方法，返回 true 表示这个节点可以显示，返回 false 则表示这个节点会被隐藏 */
      filterNodeMethod: Function,
        /* 是否每次只打开一个同级树节点展开 */
      accordion: Boolean,
        /* 相邻级节点间的水平缩进，单位为像素 */
      indent: {
        type: Number,
        default: 18
      }
    },

    computed: {
      children: {
          /* 当`children`被改变时，`data`同时进行更新 */
        set(value) {
          this.data = value;
        },
        get() {
          return this.data;
        }
      }
    },

    // `defaultCheckedKeys`,`defaultExpandedKeys`,`data`,可以后续进行修改
    watch: {
      defaultCheckedKeys(newVal) {
        this.store.defaultCheckedKeys = newVal;
        this.store.setDefaultCheckedKey(newVal);
      },
      defaultExpandedKeys(newVal) {
        this.store.defaultExpandedKeys = newVal;
        this.store.setDefaultExpandedKeys(newVal);
      },
      data(newVal) {
        this.store.setData(newVal);
      }
    },

    //　一些对外暴露的事件
    methods: {
      filter(value) {
        if (!this.filterNodeMethod) throw new Error('[Tree] filterNodeMethod is required when filter');
        this.store.filter(value);
      },
      getNodeKey(node, index) {
        const nodeKey = this.nodeKey;
        if (nodeKey && node) {
          return node.data[nodeKey];
        }
        return index;
      },
      getCheckedNodes(leafOnly) {
        return this.store.getCheckedNodes(leafOnly);
      },
      getCheckedKeys(leafOnly) {
        return this.store.getCheckedKeys(leafOnly);
      },
      getCurrentNode() {
        const currentNode = this.store.getCurrentNode();
        return currentNode ? currentNode.data : null;
      },
      getCurrentKey() {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in getCurrentKey');
        const currentNode = this.getCurrentNode();
        return currentNode ? currentNode[this.nodeKey] : null;
      },
      setCheckedNodes(nodes, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedNodes');
        this.store.setCheckedNodes(nodes, leafOnly);
      },
      setCheckedKeys(keys, leafOnly) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCheckedKeys');
        this.store.setCheckedKeys(keys, leafOnly);
      },
      setChecked(data, checked, deep) {
        this.store.setChecked(data, checked, deep);
      },
      setCurrentNode(node) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentNode');
        this.store.setUserCurrentNode(node);
      },
      setCurrentKey(key) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in setCurrentKey');
        this.store.setCurrentNodeKey(key);
      },
      handleNodeExpand(nodeData, node, instance) {
        this.broadcast('ElTreeNode', 'tree-node-expand', node);
        /* 节点被展开时触发的事件 */
        this.$emit('node-expand', nodeData, node, instance);
      },
      updateKeyChildren(key, data) {
        if (!this.nodeKey) throw new Error('[Tree] nodeKey is required in updateKeyChild');
        this.store.updateChildren(key, data);
      }
    },

    created() {
      this.isTree = true;

      // 以下字段，在树渲染完成之后，再次修改这些字段则无法生效，需要重新销毁树后才能生效
      // 除了`defaultCheckedKeys`,`defaultExpandedKeys`,`data`,在watch中做了处理
      this.store = new TreeStore({
        key: this.nodeKey,
        data: this.data,
        lazy: this.lazy,
        props: this.props,
        load: this.load,
        currentNodeKey: this.currentNodeKey,
        checkStrictly: this.checkStrictly,
        checkDescendants: this.checkDescendants,
        defaultCheckedKeys: this.defaultCheckedKeys,
        defaultExpandedKeys: this.defaultExpandedKeys,
        autoExpandParent: this.autoExpandParent,
        defaultExpandAll: this.defaultExpandAll,
        filterNodeMethod: this.filterNodeMethod
      });
      this.root = this.store.root;
    }
  };
</script>
