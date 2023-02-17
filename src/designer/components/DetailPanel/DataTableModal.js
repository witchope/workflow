import React, {useState} from "react";
import {Modal} from "antd";

const DataTableModal = ({visible,title,onOk,onCancel,data,cols,newRowKeyPrefix,lang}) => {
  const [changedData,setChangedData] = useState([]);
  const handleOk = () => {
    const updateData = data.map(d => {
      const updater = changedData.find(s => d.id === s.id);
      if (updater) {
        if(updater.isDelete){
          return false;
        } else {
          const u = {...d, ...updater};
          delete u.isNew;
          delete u.isUpdate;
          return u;
        }
      }
      return d;
    }).filter(s => !!s);
    const newData = changedData.filter(s => s.isNew).map(s => { delete s.isNew; delete s.isUpdate; return s;});
    const result = newData.concat(updateData);
    onOk(result);
  };
  const handleCancel = () => {
    setChangedData([]);
    onCancel();
  };
  return (
    <Modal title={title}
           destroyOnClose
           visible={visible}
           onOk={handleOk}
           onCancel={handleCancel}
           width={800}
           maskClosable={false}>
    </Modal>
  )
};

export default DataTableModal;
