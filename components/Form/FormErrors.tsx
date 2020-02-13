import React, {useMemo} from "react";
import {useFormikContext} from "formik";
import styled from "@emotion/styled";

import {convertErrors, useFormContext} from "./utils";

type FormErrorsProps = {
    className?: string;
}

const ErrorHeader = styled.header`
  margin: 0 0 10px 0;

  .title {
    font-size: 2rem;  
  }
`;

const ErrorContainer = styled.div`
  margin: 0 0 15px 0;
  padding: 0 0 15px 0;
  border-bottom: 1px solid #ccc;
  
  > ul > li {
    padding: 0 0 5px 0;
    
    &:last-of-type {
      padding-bottom: 0;
    }
  }

  a {
    color: var(--invalid-color);
    text-decoration: none;
  }
`;

export const FormErrors = <T, P, S>({className}: FormErrorsProps) => {
    const {errors} = useFormikContext<T>();
    const {formData} = useFormContext<T, P, S>();

    const errorList = useMemo(() => convertErrors(formData.state.formId, errors), [formData.state.formId, errors]);

    return (errorList && errorList.length > 0 && (
        <ErrorContainer className={className} role="alert">
            <ErrorHeader>
                <h2 className="title">Please review the following errors:</h2>
            </ErrorHeader>
            <ul>
                {errorList.map(error => (
                    <li key={error.id}>
                        <a href={`#${error.id}`}>
                            {error.message}
                        </a>
                    </li>
                ))}
            </ul>
        </ErrorContainer>
    )) || null;
};
