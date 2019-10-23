import React, {useEffect} from 'react'
import {Helmet} from 'react-helmet-async'
import styled from "styled-components";

import Page from '../styles/Page'
import TestMyStyled from "../TestMyStyled";

import Select from 'react-select';

const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];


const Title = styled.h2`
    color: #ccc;
`;

const BasicSelectContainer = styled.form`
  display: flex;
  width: 100%;
  font-size: 16px;
`;

const BasicSelect = styled.select`
  font-size: inherit;
  height: 36px;
  background-color: transparent;
  flex-grow: 1;
  border-color: rgb(204, 204, 204);
`;
const Button = styled.button`
  font-size: inherit;
  padding: 5px;
  border: 1px solid #ccc;
  background-color: #eee;
  border-radius: 3px;
  margin-left: 8px;
`

const Home = () => {
    console.log("******HOME RENDER")
    useEffect(() => {
        console.log("******HOME HOOK")
    }, []);

    return (
        <Page>
            <Helmet>
                <title>Home Page</title>
            </Helmet>

            <Title>
                Home page
            </Title>

            {process.browser ?
                <Select
                    options={options}
                />
                :
                <BasicSelectContainer className="no-js">
                    <BasicSelect>
                        <option>Select...</option>
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </BasicSelect>
                    <Button>Go</Button>
                </BasicSelectContainer>
            }

            {/*<TestMyStyled/>*/}

            <p>END.</p>
        </Page>
    )
}

export default Home
