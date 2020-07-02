import React, {useEffect, useState} from "react";
import {connect} from "react-redux";
import {AppState} from "../../reducers";
import * as actions from "../../actions";
import {Kitten} from "../../components/api";
import TextInput from "react-responsive-ui/modules/TextInput";
import styled from "@emotion/styled";

type PouchDBTestProps = {
  kitten?: Kitten;
  exampleGetDBItem: (id: string) => Kitten;
  exampleUpdateDBItem: (item: Kitten) => Kitten;
}

export const Container = styled.main`
  max-width: 100vw;
  padding: 2em 1em;
`;

const PouchDBTest = ({kitten, exampleGetDBItem, exampleUpdateDBItem}: PouchDBTestProps) => {

  useEffect(() => {
    exampleGetDBItem("mittens");
  }, [exampleGetDBItem]);

  const [name, setName] = useState("");

  const kittenName = kitten?.name;

  useEffect(() => {
    setName(kittenName || "");
  }, [kittenName]);

  const handleChangeName = (value: string) => {
    setName(value);

    if (kitten) {
      exampleUpdateDBItem({
        ...kitten,
        name: value
      });
    }
  };

  return (
    <Container>
      <TextInput
        label="Name"
        value={name}
        // disabled={disabled}
        onChange={handleChangeName}
      />
    </Container>
  );
};

const container = connect(
  ({example: {kitten}}: AppState) => ({
    kitten
  } as PouchDBTestProps),
  {
    exampleGetDBItem: actions.exampleActions.exampleGetDBItem,
    exampleUpdateDBItem: actions.exampleActions.exampleUpdateDBItem,
  }
)(PouchDBTest);

export default container;
