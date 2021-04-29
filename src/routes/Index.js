import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "../components/home/index";
import Cart from "../components/cart/index";

import DispenseError from "../components/dispense/dispense_error";
import DispenseNoStock from "../components/dispense/no_stock";
import DispenseSuccess from "../components/dispense/dispense_success";

import PaymentCancelled from "../components/payment/payment_cancelled";
import PaymentError from "../components/payment/payment_error";
import PaymentExpired from "../components/payment/payment_expired";
import PaymentExpiryCheck from "../components/payment/payment_expiry_check";
import PaymentSuccess from "../components/payment/payment_success";
import PaymentStatusError from "../components/payment/payment_status_error";
import PaymentGoPay from "../components/payment/gopay";
import PaymentOvo from "../components/payment/ovo";

import ManagementLogin from "../components/management/login";
import ManagementIndex from "../components/management/index";
import ManagementAutoTopup from "../components/management/auto_topup";
import ManagementManualTopup from "../components/management/manual_topup";
import ManagementButtonConfig from "../components/management/button_config";
import ManagementLogout from "../components/management/logout";

import ErrorNotFound from "../components/error/404_error";
import ErrorInternal from "../components/error/500_error";

export default (
  <Router>
    <Switch>
		{/* Index */}
		<Route path="/" exact component={Home} />

		{/* Cart */}
		<Route path="/cart/:id" exact component={Cart} />

		{/* Dispense */}
		<Route path="/dispense/error" exact component={DispenseError} />
		<Route path="/dispense/no_stock" exact component={DispenseNoStock} />
		<Route path="/dispense/success" exact component={DispenseSuccess} />

		{/* Payment */}
		<Route path="/payment/cancelled" exact component={PaymentCancelled} />
		<Route path="/payment/error" exact component={PaymentError} />
		<Route path="/payment/expired" exact component={PaymentExpired} />
		<Route path="/payment/expiry_check" exact component={PaymentExpiryCheck} />
		<Route path="/payment/status_error" exact component={PaymentStatusError} />
		<Route path="/payment/success" exact component={PaymentSuccess} />
		<Route path="/payment/gopay/:price" exact component={PaymentGoPay} />
		<Route path="/payment/ovo" exact component={PaymentOvo} />

		{/* Management */}
		<Route path="/management/login" exact component={ManagementLogin} />
		<Route path="/management" exact component={ManagementIndex} />
		<Route path="/management/auto_topup" exact component={ManagementAutoTopup} />
		<Route path="/management/manual_topup" exact component={ManagementManualTopup} />
		<Route path="/management/button_config" exact component={ManagementButtonConfig} />
		<Route path="/management/logout" exact component={ManagementLogout} />

		{/* Error */}
		<Route path="/error/404" exact component={ErrorNotFound} />
		<Route path="/error/500" exact component={ErrorInternal} />
    </Switch>
  </Router>
);