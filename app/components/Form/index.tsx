import React, {useCallback, useContext, useState, useEffect, ReactEventHandler, FormEvent} from 'react'
import styled, {css} from "styled-components";

import useWhatChanged from "components/whatChanged/useWhatChanged";

import {FormDataContext, useFormData, FormData} from "components/Form";
import ReactSelect from "react-select";
import useEffectAction from "components/actions/useEffectAction";
import {errorLike} from "components/error";

const Form = styled.form`
  display: flex;
  width: 100%;
  font-size: 16px;
`;

const SelectStyle = css`
  font-size: inherit;
  height: 36px;
  background-color: transparent;
  flex-grow: 1;
  border-color: rgb(204, 204, 204);
`
const BasicSelect = styled.select`
  ${SelectStyle}
`;
const Select = styled(ReactSelect)`
  ${SelectStyle}
`
const Button = styled.button`
  font-size: inherit;
  padding: 5px;
  border: 1px solid #ccc;
  background-color: #eee;
  border-radius: 3px;
  margin-left: 8px;
`

const options = [
    { value: '', label: 'Select...' },
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
];

type Option = {
    value: string;
    label: string;
}

const FancySelect = ({options, name, value, onChange}: {options: Option[]; name: string; value?: string; onChange: (value: Option) => void;}) => {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (isClient) {
        const defaultValue = (value && options.filter(option => option.value ===value)[0]) || options[0];
        return (
            <Select
                name={name}
                defaultValue={defaultValue}
                options={options}
                onChange={onChange}
            />
        )
    } else {
        return (
            <BasicSelect
                className="no-js"
                name={name}
                value={value}
            >
                {options.map((option, index) => (
                    <option key={index} value={option.value}>{option.label}</option>
                ))}
            </BasicSelect>
        )
    }
}

type MyForm = {
    flavour: string;
}

type MyFormResponse = {
    chosenFlavour: string;
}


const MyForm = () => {
    const data = useFormData<MyForm, MyFormResponse>();

    const [formData, setFormData] = useState(data);

    const {flavour} = formData.data;

    const isValid = Boolean(formData.isSubmitted && flavour);

    console.log("@@@@@", formData, formData.payload)

    const submit = (formData: FormData) => {
        console.log("@@@@@: CALL API", formData)
        formData.isProcessed = true;
        return new Promise<MyFormResponse>(resolve => {
            if (flavour === "vanilla") {
                // throw new APIError("Authentication Failed", "auth", 403)
                throw new Error("Bumhole!")
            }
            setTimeout(() => {
                resolve({chosenFlavour: `CHOSEN: ${flavour}`});
            }, 2000);
        })
            .then(payload => {
                formData.payload = payload
                return payload
            })
            .catch(ex => {
                formData.error = errorLike(ex);
                throw ex;
            })
    }

    const handleSubmit = (e: FormEvent) => {
        console.log(">>>", formData)

        setFormData(formData => ({...formData, isSubmitted: true, isProcessed: true, error: undefined}))

        submit(formData)
            .then((payload: any) => {
                console.log("END", payload)
                setFormData(formData => ({...formData, payload}))
            })
            .catch(error => {
                setFormData(formData => ({...formData, isSubmitted: false, isProcessed: false, error}))
            })

        e.preventDefault();
    }

    const handleChange = ({value}: Option) => {
        console.log(">>>!!", value)
        setFormData(formData => ({...formData, isSubmitted: false, isProcessed: false, error: undefined, data: {...formData.data, flavour: value}}))
    }

    useEffectAction(
        () => submit(formData),
        () => formData.isSubmitted && !formData.isProcessed && isValid
    );

    // useWhatChanged(About, { formData, items, item, onExampleGetList, onExampleGetItem, onExampleEditItem, $status, renderListItem, page});

    return (
        <div>
            {formData.payload && <p>{formData.payload.chosenFlavour}</p>}
            {(isValid && !formData.error) && <p>You submitted '{flavour}'</p>}
            {formData.error && <p style={{color: "red"}}>There was a problem submitting</p>}
            {(formData.isSubmitted && !isValid) && <p style={{color: "red"}}>Flavour is required</p>}
            <Form method="post" action="">
                <FancySelect
                    options={options}
                    name="flavour"
                    value={formData.data["flavour"]}
                    onChange={handleChange}
                />
                <Button
                    type="submit"
                    onClick={handleSubmit}
                >
                    Go
                </Button>
            </Form>
        </div>
    )
}

export default MyForm
