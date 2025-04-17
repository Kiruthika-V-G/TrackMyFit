import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getProfile } from '../api';

const Name = styled.div`
    color: ${({ theme }) => theme.text_primary};
`;
const Email = styled.div`
    color: ${({ theme }) => theme.text_primary};
`;

const Profile = ({ currentUser }) => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const getProfileData = async () => {
      const token = localStorage.getItem("trackmyfit-app-token");
      const res = await getProfile(token);
      setProfileData(res?.data?.user); // or whatever structure your backend returns
    };
    getProfileData();
  }, []);

  return (
    <>
      <Name>Name : {profileData?.name || currentUser?.name}</Name>
      <Email>Email : {profileData?.email || currentUser?.email}</Email>
      
    </>
  );
};

export default Profile;
