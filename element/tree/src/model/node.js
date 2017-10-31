import objectAssign from 'element-ui/src/utils/merge';
import { markNodeData, NODE_KEY } from './util';

// 获取节点的勾选状态
export const getChildState = node => {
  let all = true;   // 节点都是勾选状态
  let none = true;  // 节点都是未勾选状态
  let allWithoutDisable = true;  // 节点都可勾选
  for (let i = 0, j = node.length; i < j; i++) {
    const n = node[i];
    // 节点都是勾选状态或者节点是非半选状态
    if (n.checked !== true || n.indeterminate) {
      all = false;
      if (!n.disabled) {
        allWithoutDisable = false;
      }
    }
    // 节点都是未勾选状态或者节点是非半选状态
    if (n.checked !== false || n.indeterminate) {
      none = false;
    }
  }
  // `half`：节点不是全勾选且不是全非勾选，即使半选状态
  return { all, none, allWithoutDisable, half: !all && !none };
};

// 重新初始化节点勾选状态
const reInitChecked = function(node) {
  if (node.childNodes.length === 0) return;

  const {all, none, half} = getChildState(node.childNodes);
  if (all) {
    node.checked = true;
    node.indeterminate = false;
  } else if (half) {
    node.checked = false;
    node.indeterminate = true;
  } else if (none) {
    node.checked = false;
    node.indeterminate = false;
  }

  // 从下而上递归初始化节点的勾选状态
  const parent = node.parent;
  if (!parent || parent.level === 0) return;

  if (!node.store.checkStrictly) {
    reInitChecked(parent);
  }
};

// 获取某个参数的值
const getPropertyFromData = function(node, prop) {
  const props = node.store.props;
  const data = node.data || {};
  const config = props[prop];

  if (typeof config === 'function') {
    return config(data, node);
  } else if (typeof config === 'string') {
    return data[config];
  } else if (typeof config === 'undefined') {
    const dataProp = data[prop];
    return dataProp === undefined ? '' : dataProp;
  }
};

let nodeIdSeed = 0;

export default class Node {
  constructor(options) {
    this.id = nodeIdSeed++;
    this.text = null;
    this.checked = false;
    // 半选状态为`true`，其余状态都为`false`
    this.indeterminate = false;
    this.data = null;
    this.expanded = false;
    this.parent = null;
    this.visible = true;
    for (let name in options) {
      if (options.hasOwnProperty(name)) {
        this[name] = options[name];
      }
    }

    // internal
    this.level = 0;
    this.loaded = false;
    this.childNodes = [];
    this.loading = false;
    if (this.parent) {
      this.level = this.parent.level + 1;
    }

    const store = this.store;
    if (!store) {
      throw new Error('[Node]store is required!');
    }

    // 注册树节点与nodeKey的映射关系
    store.registerNode(this);

    const props = store.props;
    if (props && typeof props.isLeaf !== 'undefined') {
      // 获取指定子节点的字段的数据，可以通过数据中某个字段来指定是否是子节点
      const isLeaf = getPropertyFromData(this, 'isLeaf');
      if (typeof isLeaf === 'boolean') {
        this.isLeafByUser = isLeaf;
      }
    }

    if (store.lazy !== true && this.data) {
      this.setData(this.data);

      // 如果设置了展开所有，则将每个节点都展开
      if (store.defaultExpandAll) {
        this.expanded = true;
      }
    } else if (this.level > 0 && store.lazy && store.defaultExpandAll) {
      this.expand();
    }

    if (!this.data) return;
    const defaultExpandedKeys = store.defaultExpandedKeys;
    const key = store.key;
    // 展开默认展开节点
    if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) !== -1) {
      this.expand(null, store.autoExpandParent);
    }

    // 设置当前节点
    if (key && store.currentNodeKey !== undefined && this.key === store.currentNodeKey) {
      store.currentNode = this;
    }

    // 异步树加载
    if (store.lazy) {
      store._initDefaultCheckedNode(this);
    }

    this.updateLeafState();
  }

  setData(data) {
    if (!Array.isArray(data)) {
      markNodeData(this, data);
    }

    this.data = data;
    this.childNodes = [];
    let children;
    if (this.level === 0 && this.data instanceof Array) {
      children = this.data;
    } else {
      // 获取树节点子节点`children`的数据
      children = getPropertyFromData(this, 'children') || [];
    }

    for (let i = 0, j = children.length; i < j; i++) {
      // 生成树节点
      this.insertChild({ data: children[i] });
    }
  }

  // 获取树节点数据中`label`字段的值
  get label() {
    return getPropertyFromData(this, 'label');
  }

  //  获取树节点数据中`icon`字段的值
  get icon() {
    return getPropertyFromData(this, 'icon');
  }

  // 获取树节点的唯一标识`nodeKey`
  get key() {
    const nodeKey = this.store.key;
    if (this.data) return this.data[nodeKey];
    return null;
  }

  //  获取树节点数据中`disabled`字段的值
  get disabled() {
    return getPropertyFromData(this, 'disabled');
  }

  /**
   * 插入一个树节点
   * @param child 新的树节点数据
   * @param index 指定需要插入的位置，默认是末尾插入
   */
  insertChild(child, index) {
    if (!child) throw new Error('insertChild error: child is required.');

    if (!(child instanceof Node)) {
      objectAssign(child, {
        parent: this,
        store: this.store
      });
      // 生成一个新的树节点
      child = new Node(child);
    }

    // 设置节点的层级
    child.level = this.level + 1;

    if (typeof index === 'undefined' || index < 0) {
      // 末尾插入
      this.childNodes.push(child);
    } else {
      // 插入指定位置
      this.childNodes.splice(index, 0, child);
    }

    this.updateLeafState();
  }

  insertBefore(child, ref) {
    let index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
    }
    this.insertChild(child, index);
  }

  insertAfter(child, ref) {
    let index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
      if (index !== -1) index += 1;
    }
    this.insertChild(child, index);
  }

  // 根据树节点移除子节点
  removeChild(child) {
    const index = this.childNodes.indexOf(child);

    if (index > -1) {
      //　注销`nodeMaps`中的映射关系
      this.store && this.store.deregisterNode(child);
      child.parent = null;
      this.childNodes.splice(index, 1);
    }

    this.updateLeafState();
  }

  // 根据现有的数据移除子节点数据
  removeChildByData(data) {
    let targetNode = null;
    this.childNodes.forEach(node => {
      if (node.data === data) {
        targetNode = node;
      }
    });

    if (targetNode) {
      this.removeChild(targetNode);
    }
  }

  expand(callback, expandParent) {
    const done = () => {
      if (expandParent) {
        let parent = this.parent;
        // 逐级展开父节点
        while (parent.level > 0) {
          parent.expanded = true;
          parent = parent.parent;
        }
      }
      this.expanded = true;
      if (callback) callback();
    };

    // 异步加载树
    if (this.shouldLoadData()) {
      this.loadData((data) => {
        if (data instanceof Array) {
          if (this.checked) {
            this.setChecked(true, true);
          } else {
            reInitChecked(this);
          }
          done();
        }
      });
    } else {
      done();
    }
  }

  // 插入节点数据
  doCreateChildren(array, defaultProps = {}) {
    array.forEach((item) => {
      this.insertChild(objectAssign({ data: item }, defaultProps));
    });
  }

  // 收起节点
  collapse() {
    this.expanded = false;
  }

  // 只有在异步加载的时候才会返回true
  shouldLoadData() {
    return this.store.lazy === true && this.store.load && !this.loaded;
  }

  // 更新节点状态，判断是否为子节点
  updateLeafState() {
    if (this.store.lazy === true && this.loaded !== true && typeof this.isLeafByUser !== 'undefined') {
      this.isLeaf = this.isLeafByUser;
      return;
    }
    const childNodes = this.childNodes;
    if (!this.store.lazy || (this.store.lazy === true && this.loaded === true)) {
      this.isLeaf = !childNodes || childNodes.length === 0;
      return;
    }
    this.isLeaf = false;
  }

  /**
   * 设置节点的选中状态
   * @param value 当前节点的勾选状态
   * @param deep 是否处理子节点
   * @param recursion
   * @param passValue
   *
   */
  setChecked(value, deep, recursion, passValue) {
    this.indeterminate = value === 'half';
    this.checked = value === true;

    // 父子节点是否关联
    if (this.store.checkStrictly) return;
    if (!(this.shouldLoadData() && !this.store.checkDescendants)) {
      // 获取设置的节点的子节点选中状态
      let { all, allWithoutDisable } = getChildState(this.childNodes);

      // 非子节点 && （其子节点有未勾选的 && 没有不可勾选的节点）这个人话不知道怎么翻译--！
      if (!this.isLeaf && (!all && allWithoutDisable)) {
        this.checked = false;
        value = false;
      }

      // 处理改节点的子节点
      const handleDescendants = () => {
        if (deep) {
          const childNodes = this.childNodes;
          for (let i = 0, j = childNodes.length; i < j; i++) {
            const child = childNodes[i];
            passValue = passValue || value !== false;
            const isCheck = child.disabled ? child.checked : passValue;
            child.setChecked(isCheck, deep, true, passValue);
          }
          const { half, all } = getChildState(childNodes);
          if (!all) {
            this.checked = all;
            this.indeterminate = half;
          }
        }
      };

      if (this.shouldLoadData()) {
        // Only work on lazy load data.
        this.loadData(() => {
          handleDescendants();
          reInitChecked(this);
        }, {
          checked: value !== false
        });
        return;
      } else {
        handleDescendants();
      }
    }

    const parent = this.parent;
    if (!parent || parent.level === 0) return;

    if (!recursion) {
      // `setChecked`方法只有设置当前节点及其子节点勾选状态，
      // 通过`reInitChecked`设置当前节点的父节点勾选状态
      reInitChecked(parent);
    }
  }

  // 获取子节点数据
  getChildren() { // this is data
    const data = this.data;
    if (!data) return null;

    const props = this.store.props;
    // 获取数据中子节点的`key`
    let children = 'children';
    if (props) {
      children = props.children || 'children';
    }

    if (data[children] === undefined) {
      data[children] = null;
    }

    return data[children];
  }

  updateChildren() {
    const newData = this.getChildren() || [];
    const oldData = this.childNodes.map((node) => node.data);

    const newDataMap = {};
    const newNodes = [];

    newData.forEach((item, index) => {
      // 原有的树节点数据
      if (item[NODE_KEY]) {
        newDataMap[item[NODE_KEY]] = { index, data: item };
      } else {
        // 新增的树节点数据
        newNodes.push({ index, data: item });
      }
    });

    // 移除原有数据与现有数据有差异的节点
    oldData.forEach((item) => {
      if (!newDataMap[item[NODE_KEY]]) this.removeChildByData(item);
    });

    //　将新增的节点重新插入
    newNodes.forEach(({ index, data }) => {
      this.insertChild({ data }, index);
    });

    this.updateLeafState();
  }

  // 异步树加载时，重新加载数据
  loadData(callback, defaultProps = {}) {
    if (this.store.lazy === true && this.store.load && !this.loaded && (!this.loading || Object.keys(defaultProps).length)) {
      this.loading = true;

      const resolve = (children) => {
        this.loaded = true;
        this.loading = false;
        this.childNodes = [];

        this.doCreateChildren(children, defaultProps);

        this.updateLeafState();
        if (callback) {
          callback.call(this, children);
        }
      };

      this.store.load(this, resolve);
    } else {
      if (callback) {
        callback.call(this);
      }
    }
  }
}
