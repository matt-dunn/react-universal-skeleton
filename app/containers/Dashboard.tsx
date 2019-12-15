import React from "react";
import {Helmet} from "react-helmet-async";
import loadable from "@loadable/component";

import Page from "../styles/Page";

const StatsI18n = loadable(() => import("app/components/dashboard/stats/i18n"));

const Dashboard = () => {
    return (
        <Page>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>

            <StatsI18n/>
        </Page>
    );
};

export default Dashboard;
