import React from "react";
import {Helmet} from "react-helmet-async";
import loadable from "@loadable/component";

import {Main} from "app/styles/Components";

const StatsI18n = loadable(() => import("app/components/dashboard/stats/i18n"));

const Dashboard = () => {
    return (
        <Main>
            <Helmet>
                <title>Dashboard</title>
            </Helmet>

            <StatsI18n/>
        </Main>
    );
};

export default Dashboard;
