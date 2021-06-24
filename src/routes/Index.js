import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/home/Index";

import Sale from "../components/sale/index";
import SaleSucces from "../components/sale/success";

import DispenseError from "../components/dispense/dispense_error";
import DispenseNoStock from "../components/dispense/no_stock";
import DispenseSuccess from "../components/dispense/dispense_success";
import Dispensing from '../components/dispense/Dispensing';

import ManagementLogin from "../components/management/Login";
import ManagementIndex from "../components/management/Index";
import ManagementAutoTopup from "../components/management/AutoTopup";
import ManagementManualTopup from "../components/management/ManualTopup";
import ManagementButtonConfig from "../components/management/button_mapping";

import ErrorNotFound from "../components/error/404_error";
import ErrorInternal from "../components/error/500_error";

export default (
  <Router>
    <Switch>
		{/* Index */}
		<Route path="/" exact component={Home} />

		{/* Sale */}
		<Route path="/sales/:product_id/:amount" component={Sale} />
		<Route path="/sales/success" exact component={SaleSucces} />

		{/* Dispense */}
		<Route path="/dispense/:slot_id" exact component={Dispensing} />
		<Route path="/dispense/error" exact component={DispenseError} />
		<Route path="/dispense/no_stock" exact component={DispenseNoStock} />
		<Route path="/dispense/success" exact component={DispenseSuccess} />

		{/* Management */}
		<Route path="/management/login" exact component={ManagementLogin} />
		<Route path="/management" exact component={ManagementIndex} />
		<Route path="/management/auto_topup" exact component={ManagementAutoTopup} />
		<Route path="/management/manual_topup" exact component={ManagementManualTopup} />
		<Route path="/management/button_config" exact component={ManagementButtonConfig} />

		{/* Error */}
		<Route path="/error/404" exact component={ErrorNotFound} />
		<Route path="/error/500" exact component={ErrorInternal} />
    </Switch>
  </Router>
);