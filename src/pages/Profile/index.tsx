import { Button, Card, Col, Form, Input, message, Modal, Row } from 'antd';
import  React, { useCallback, useEffect, useState } from 'react';
// import { Config } from "../../../src/config/config"; 
// @ts-ignore
import { Config, callApi } from "@intellinum/flexa-util";
// import TextArea from 'antd/es/input/TextArea';
// import toast from 'react-hot-toast';
const imageStyle = {
  width: 220,
  height: 'auto',
};

export const Profi = () => {
const [userId, setId] = useState(0);
const [isModalVisible, setIsModalVisible] = useState(false);
const [modalContent, setModalContent] = useState(null);
const [fetch, setFetch] = useState(true);
const [formData, setFormData] = useState("");
const apiUrl = Config.prefixUrl + "/common/company";
const { TextArea } = Input;

const showModal = () => {
  if (formData.trim() === "") {
    setModalContent(
      <div>
       <p style={{color:"grey"}}>Silahkan isi Form dulu</p>
      </div>
    );
  } 
  // setIsModalVisible(false);
  setIsModalVisible(true);
};
const [vision, setVision] = useState("");
const [goal, setGoal] = useState("");
const [ethic, setEthic] = useState("");

const handleCancel = () => {
  setIsModalVisible(false);
};

// const [user, setUser] = useState(
//   JSON.parse(localStorage.getItem("flexa_auth")) || {} // Baca dari localStorage, atau gunakan objek kosong jika belum ada
// );

const handleOk = useCallback(
  async () => {
    

    const company = JSON.parse(localStorage.getItem("flexa_auth"))
    const payload = {
      vision: vision, 
      goal: goal,     
      ethic: ethic,  
    };
    console.log(" componyyyyy" , company)
    
    try {
      await callApi(`${apiUrl}/${company.company.id}`, "PUT", payload);
      const updatedUser = {
        ...user, 
        vision: vision, 
        goal: goal,     
        ethic: ethic,   
      };
      localStorage.setItem("flexa_auth", JSON.stringify(updatedUser));
      message.success("Successfully edited data");
      setFetch(true);
      setIsModalVisible(false);
    } catch (error) {
      console.error("Errorrrrr:", error);
      message.error("Something went wrong!");
    }
  },
  [fetch, apiUrl, userId, vision, goal, ethic]
);


const [user, setUser] = useState(
  JSON.parse(localStorage.getItem("flexa_auth"))
);

  return (
    <div>
      <div className="d-flex justify-content-center p-5 m-4">
        <Button style={{width: 1000, height: 55}} type="primary" onClick={showModal}>
          Edit
        </Button></div>
    <Row gutter={[16, 16]}>
      <div className="row d-flex justify-content-center warp gap-2 w-100 mb-5">
        <Col style={{ width: 510, margin: 2 }}>
          <div className='row row-cols-3'>
            <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 440, margin: 30, padding: 20 }}
              hoverable title="Visions"
              cover={
                <img alt="example" style={imageStyle}
                  src="https://th.bing.com/th/id/OIP.KRtgNVRIX3nQQP6NL8Qj_QHaHa?pid=ImgDet&w=206&h=206&c=7" />
              }>
              <ul><li>Build the best pr and be the number one leader in supply chain execution.</li></ul>
              
            </Card>
          </div>
        </Col>
        <Col style={{ width: 500, margin: 2 }}>
          <div className='row row-cols-1'>
            <Card title="Goals" hoverable style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 440, margin: 30, padding: 20 }}
              cover={<img alt="example" style={imageStyle} src="https://th.bing.com/th/id/OIP.pkU6NtS8gzgDV4jPjBwicAHaHa?pid=ImgDet&rs=1" />}>
              <ul>
                <li>Achieve 100% customer satisfaction.</li>
                <li>Deliver the correct product to the customer, in the right quantity, at th right time, in the right condition, with the right documentation and at t right cost.</li>
                <li>Improve.</li>
              </ul>
            </Card>
          </div>
        </Col>
        <Col style={{ width: 500, margin: 2 }}>
          <div className='row row-cols-1'>
            <Card title="Ethics" hoverable style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 440, margin: 30, padding: 20 }}
              cover={<img alt="example" style={imageStyle} src="https://thumbs.dreamstime.com/b/ethics-vector-icon-scales-white-eps-file-easy-to-edit-208831439.jpg" />}>
              <ul>
                <li>Our corporate ethics include integrity, transparency and a commitment to always act according to high moral values in all aspects of our business.</li>
                {/* <li>{formData}</li> */}
              </ul>
            </Card>
          </div>
        </Col>
      </div>
    </Row>
      <Modal
        title="Edit"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={() => {}}
          onFinishFailed={() =>{}}>
          <Form.Item label="Vision">
            <TextArea rows={4} id="vision" name="vision" value={vision} onChange={(e) => setVision(e.target.value)}/>
          </Form.Item>
          <Form.Item label="Goal">
            <TextArea rows={4} id="goal" name="goal" value={goal} onChange={(e) => setGoal(e.target.value)} />
          </Form.Item>
          <Form.Item label="Ethic">
            <TextArea rows={4} id="ethic" name="ethic" value={ethic} onChange={(e) => setEthic(e.target.value)}/>
          </Form.Item>

        </Form>
        {modalContent}
      </Modal>
    </div>
  );
};

