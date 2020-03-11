import React, { useEffect, useRef } from 'react';
import { Table, Button, Checkbox } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { useModel } from '@tarocch1/use-model';
import { MainModel } from '../../models';
import { IProxyFormData } from '../../types';

const type = 'DragbleBodyRow';

const DragableBodyRow = ({ index, moveRow, className, ...restProps }: any) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: item => {
      console.log(item);
      moveRow((item as any).index, index);
    },
  });
  const [, drag] = useDrag({
    item: { type, index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  return <tr ref={ref} className={`${className}${isOver ? dropClassName : ''}`} {...restProps} />;
};

const DragableBodyCell = ({ className, ...restProps }: any) => {
  const ref = useRef<HTMLTableDataCellElement>();
  const stopDrag: EventListener = e => {
    e.stopImmediatePropagation();
    e.preventDefault();
  };
  useEffect(() => {
    if (!className.includes('dragable-table-cell')) {
      ref.current?.addEventListener('dragstart', stopDrag);
      return () => {
        ref.current?.removeEventListener('dragstart', stopDrag);
      };
    }
  }, []);
  return <td ref={ref} className={className} draggable={true} {...restProps} />;
};

function List() {
  const mainModel = useModel(MainModel);
  const columns: ColumnProps<IProxyFormData>[] = [
    {
      key: 'checkbox',
      align: 'right',
      render: (record: IProxyFormData) => (
        <Checkbox checked={record.id === mainModel.currentProxy} onChange={e => onCheckboxChange(e, record.id)} />
      ),
      width: 40,
    },
    {
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      key: 'setting',
      align: 'center',
      render: (record: IProxyFormData) => (
        <SettingOutlined style={{ cursor: 'pointer' }} onClick={() => edit(record)} />
      ),
      width: 30,
    },
    {
      key: 'drag',
      align: 'left',
      className: 'dragable-table-cell',
      render: () => <MenuOutlined />,
      width: 38,
    },
  ];
  const edit = (data: IProxyFormData) => {
    mainModel.setEdittingProxy(data);
    mainModel.setShowMode('edit');
  };
  const moveRow = (dragIndex: number, hoverIndex: number) => {
    const newList = [...mainModel.proxyList];
    for (const k in newList) {
      const item = newList[k];
      if (Number(k) === dragIndex) {
        newList.splice(Number(k), 1);
        newList.splice(hoverIndex, 0, item);
        break;
      }
    }
    mainModel.setProxyList(newList);
  };
  const onCheckboxChange = (e: CheckboxChangeEvent, id: string) => {
    if (e.target.checked) {
      mainModel.setCurrentProxy(id);
    } else {
      mainModel.clearProxy();
    }
  };
  useEffect(() => {
    mainModel.getProxyList();
    mainModel.getCurrentProxy();
  }, []);
  return (
    <DndProvider backend={HTML5Backend}>
      <Table
        id="list"
        size="middle"
        columns={columns}
        dataSource={mainModel.proxyList}
        components={{
          body: {
            row: DragableBodyRow,
            cell: DragableBodyCell,
          },
        }}
        onRow={(record, index) =>
          ({
            index,
            moveRow: moveRow,
          } as any)
        }
        rowKey="id"
        showHeader={false}
        pagination={false}
        footer={() => (
          <Button type="link" onClick={() => mainModel.setShowMode('edit')}>
            {chrome.i18n.getMessage('add')}
          </Button>
        )}
        locale={{
          emptyText: <div style={{ textAlign: 'center' }}>{chrome.i18n.getMessage('no_proxy')}</div>,
        }}
      />
    </DndProvider>
  );
}

export default List;
