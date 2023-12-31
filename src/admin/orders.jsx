import React, { useState, useEffect } from "react";
import "../styles/orders.css";
import { Container, Row, Col } from "reactstrap";
import useGetData from "../customhook/useGetData";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase.config";

const Orders = () => {
  const { data: Orders, loading } = useGetData(`Orders`);

  useEffect(() => {
    const shopdata = Orders.map((list) => list);
    setDetails(shopdata);
  }, [Orders]);

  const [details, setDetails] = useState([]);

  const handleToggleChange = async (index) => {
    const order = details[index];
    const orderId = order.id; // Assuming there's an 'id' property in the order object
    try {
      await updateDoc(doc(db, "Orders", orderId), { paid: !order.paid });

      // Update the local state with the new paid status
      setDetails((prevDetails) => {
        const updatedDetails = [...prevDetails];
        updatedDetails[index].paid = !order.paid;
        return updatedDetails;
      });

      console.log("Paid status updated successfully!");
    } catch (error) {
      console.error("Error updating paid status:", error);
    }
  };

  return (
    <section>
      <Container>
        <h2 className="text-center">Order details</h2>
        <div className="order_card">
          {details.map((item, index) => (
            <div className={item.paid ? "paid" : "unpaid"} key={index}>
              <Row>
                <Col lg="12">
                  <div className="d-flex">
                    <Col lg="6">
                      <div className="order_details">
                        <p>Name: {item.Name}</p>
                        <p>Mobile: {item.PhoneNumber}</p>
                        <p>Address: {item.Address}</p>
                        <p>Pincode: {item.Pincode}</p>
                        <p>Email-id: {item.email}</p>
                        <p>State: {item.state}</p>
                      </div>
                    </Col>
                    <Col lg="6">
                      <div className="order_details">
                        <p>Product type :{item.cart.length}</p>
                        {item.cart.map((items) => (
                          <>
                            <p> product name :{items.productName}</p>
                            <p> quantity :{items.quantity}</p>
                            <p> cost :{items.price}</p>
                          </>
                        ))}

                        <p>TotalAmount: {item.TotalCost}</p>
                      </div>
                    </Col>
                  </div>
                  {!item.paid ? (
                    <button
                      onClick={() => handleToggleChange(index)}
                      className="toggle-button"
                    >
                      {item.paid ? "Paid" : "Unpaid"}
                    </button>
                  ) : (
                    ""
                  )}
                </Col>
              </Row>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Orders;
