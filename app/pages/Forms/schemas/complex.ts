import * as Yup from "yup";
import {ValidationError} from "yup";

import FancySelect from "components/FancySelect";

import {validateEmailApi} from "../utils";

const schema = Yup.object().shape({
    email: Yup.string()
        .label("Email")
        .ensure()
        .meta({
            order: 1,
            props: {
                placeholder: "Enter your email",
                type: "text"
            }
        })
        .required('Email is required')
        .email()
        .test("email", "Email ${value} is unavailable", function(value: string) {
            if (!value || !Yup.string().email().isValidSync(value)) {
                return true;
            } else {
                return validateEmailApi(value)
                    .catch(reason => new ValidationError(reason.message, value, this.path))
            }
        }),
    flavour: Yup.object()
        .shape({
            favourite: Yup.string()
                .label("Flavour")
                .ensure()
                .meta({
                    order: 0,
                    category: "other",
                    Component: FancySelect,
                    props: {
                        options: [
                            { value: '', label: 'Select...' },
                            { value: 'chocolate', label: 'Chocolate' },
                            { value: 'strawberry', label: 'Strawberry' },
                            { value: 'vanilla', label: 'Vanilla' },
                        ]
                    }
                })
                .required('Flavour is required')
        }),
    notes: Yup.string()
        .required('Notes is required')
        .label("Notes")
        .ensure()
        .meta({
            order: 3,
            category: "extra",
            Component: "textarea",
            props: {
                placeholder: "Enter notes",
                type: "text"
            }
        }),
    items: Yup.array(Yup.object()
        .shape({
            name: Yup.string()
                .label("Name")
                .meta({
                    order: 0,
                    category: "set1",
                    props: {
                        placeholder: "Enter name",
                        type: "text"
                    }
                })
                .ensure()
                .required(),
            address: Yup.string()
                .label("Address")
                .meta({
                    order: 1,
                    category: "set2",
                    props: {
                        placeholder: "Enter address",
                        type: "text"
                    }
                })
                .ensure(),
            friends: Yup.array(Yup.object()
                .shape({
                    nickname: Yup.string()
                        .label("Nickname")
                        .meta({
                            order: 0,
                            props: {
                                placeholder: "Enter nickname",
                                type: "text"
                            }
                        })
                        .ensure()
                        .required(),
                })
            )
                .label("Friends")
                .meta({
                    order: 2,
                    itemLabel: "Friend"
                })
                .max(2)
        }))
        .label("People")
        .meta({
            order: 2,
            itemLabel: "Person"
        })
        .ensure()
        .min(1)
        .max(5)
});

export default schema;
