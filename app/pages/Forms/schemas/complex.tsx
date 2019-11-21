import * as Yup from "yup";
import {ValidationError} from "yup";

import loadable from "@loadable/component";

const FancySelect = loadable(() => import("components/FancySelect"));

import {validateEmailApi} from "../utils";

// import ErrorComponent from '../../../components/Error';
// import Loading from "components/Loading";
// import Pulse from "components/Loading/Pulse";

const schema = Yup.object().shape({
    email: Yup.string()
        .label("Email")
        .meta({
            order: 1,
            props: {
                placeholder: "Enter your email",
                type: "text"
            }
        })
        .required("Email is required")
        .email()
        .test("email", "Email ${value} is unavailable", function(value: string) {
            if (!value || !Yup.string().email().isValidSync(value)) {
                return true;
            } else {
                return validateEmailApi(value)
                    .catch(reason => new ValidationError(reason.message, value, this.path));
            }
        }),
    numberTest: Yup.number()
        .label("Number Type")
        .typeError("Please provide a number")
        .min(2)
        .max(10)
        .nullable()
        .transform((value: string, originalValue: string) => originalValue !== undefined  && originalValue !== null && originalValue.trim && originalValue.trim() === "" ? null: value)
        // .required()
        .meta({
            order: 2,
            category: "otherLeft"
        }),
    booleanTest: Yup.boolean()
        .label("Boolean Type")
        .meta({
            order: -1,
            category: "otherLeft"
        })
        // .default(true)
        .required()
        .oneOf([true], "${label} must be checked"),
    simpleSelect: Yup.string()
        .label("Simple Select")
        .meta({
            order: 0,
            category: "otherLeft",
            Component: "select",
            props: {
                options: [
                    { value: "", label: "Select value..." },
                    { value: "value1", label: "Value 1" },
                    { value: "value2", label: "Value 2" },
                    { value: "value3", label: "Value 3" },
                    { value: "value4", label: "Value 4" },
                    { value: "value5", label: "Value 5" },
                    { value: "value6", label: "Value 6" },
                ]
            }
        })
        .required("Simple Select is required"),
    simpleRadio: Yup.string()
        .label("Simple Radio")
        // .default("value1")
        .meta({
            order: 1,
            category: "otherLeft",
            Component: "autoselect",
            props: {
                options: [
                    { value: "", label: "None" },
                    { value: "value1", label: "Value 1" },
                    { value: "value2", label: "Value 2" },
                    { value: "value3", label: "Value 3" },
                    // { value: 'value4', label: 'Value 4' },
                ]
            }
        })
        .required(),
    flavour: Yup.object()
        .shape({
            favourite: Yup.string()
                .label("Flavour")
                .meta({
                    order: 1,
                    category: "otherRight",
                    Component: FancySelect,
                    // Component: importComponent(() => import("components/FancySelect"), {
                    //     LoadingComponent: () => <Loading height={25} loader={({height}) => <Pulse height={height}/>}/>,
                    //     ErrorComponent
                    // }),
                    // Component: importComponent(() => {
                    //     return new Promise(resolve => {
                    //         setTimeout(() => {
                    //             import("components/FancySelect")
                    //                 .then(resolve)
                    //         }, 1000)
                    //     }) as Promise<DefaultComponent<any>>
                    // }, {
                    //     LoadingComponent: function LoadingComponent(){ return <Loading height={25}/>},
                    //     ErrorComponent
                    // }),
                    props: {
                        options: [
                            { value: "", label: "Select your flavour..." },
                            { value: "chocolate", label: "Chocolate" },
                            { value: "strawberry", label: "Strawberry" },
                            { value: "vanilla", label: "Vanilla" },
                        ]
                    }
                })
                .required("Flavour is required")
        }),
    notes: Yup.string()
        .required("Notes is required")
        .label("Notes")
        .max(100)
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
                }),
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
        // .min(1)
        .max(5)
});

export default schema;
