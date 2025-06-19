import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-items : center;
  margin-left : 50px;
  margin-top : -70px;
  padding: 20px;
`;

const Card = styled.div`
  background: #fff;
  padding: 30px 40px;
  border-radius: 20px;
  box-shadow: 0 10px 20px #4d4c4c;
  max-width: 400px;
  width: 100%;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #111827;
  text-align: center;
`;

const InfoRow = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: #374151;
`;

const Value = styled.div`
  font-size: 16px;
  color: #6b7280;
`;

const Contact = () => {
  const name = process.env.REACT_APP_CONTACT_NAME;
  const email = process.env.REACT_APP_CONTACT_EMAIL;
  const phone = process.env.REACT_APP_CONTACT_PHONE;

  return (
    <Container>
      <Card>
        <Title>Contact Information</Title>
        <InfoRow>
          <Label>Name:</Label>
          <Value>{name}</Value>
        </InfoRow>
        <InfoRow>
          <Label>Email:</Label>
          <Value>{email}</Value>
        </InfoRow>
        <InfoRow>
          <Label>Phone:</Label>
          <Value>{phone}</Value>
        </InfoRow>
      </Card>
    </Container>
  );
};

export default Contact;
