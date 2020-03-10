import React, { useEffect } from 'react';
import { Table, Button } from 'antd';
import { ColumnProps } from 'antd/es/table';
import { SettingOutlined } from '@ant-design/icons';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import { useModel } from '@tarocch1/use-model';
import { MainModel } from '../../models';
import { IProxyFormData } from '../../types';

const type = 'DragbleBodyRow';

const DragableBodyRow = ({ index, moveRow, className, style, ...restProps }: any) => {
  const ref = React.useRef();
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
  return (
    <tr
      ref={ref}
      className={`${className}${isOver ? dropClassName : ''}`}
      style={{ cursor: 'move', ...style }}
      {...restProps}
    />
  );
};

function List() {
  const mainModel = useModel(MainModel);
  const columns: ColumnProps<IProxyFormData>[] = [
    {
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      key: 'setting',
      render: (record: IProxyFormData) => (
        <SettingOutlined style={{ cursor: 'pointer' }} onClick={() => edit(record)} />
      ),
      width: 40,
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
        rowSelection={{
          type: 'radio',
          selectedRowKeys: [mainModel.currentProxy],
          onChange: data => mainModel.setCurrentProxy(data[0] as string),
        }}
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
