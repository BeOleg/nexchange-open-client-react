import React from "react";
import PropTypes from "prop-types";
import jsonp from "jsonp";

const getAjaxUrl = url => url.replace("/post?", "/post-json?");
const subscribeUrl = "https://nexchange.us16.list-manage.com/subscribe/post?u=e0edfc2b2b7de21db0675f85d&amp;id=a48f384d78";

class SubscriptionForm extends React.Component {
	constructor(props, ...args) {
		super(props, ...args);
		this.state = {
			status: null,
			msg: null
		};
	}

	onSubmit = e => {
		e.preventDefault();
		if (!this.input.value ||this.input.value.length < 5 ||this.input.value.indexOf("@") === -1) {
			this.setState({
				status: "error"
			});
			return;
		}

		const url = getAjaxUrl(subscribeUrl) + `&EMAIL=${encodeURIComponent(this.input.value)}`;
		this.setState({
				status: "sending",
				msg: null
			},
			() => jsonp(
				url, {
					param: "c"
				},
				(err, data) => {
					if (err) {
						this.setState({
							status: "error",
							msg: err
						});
					} else if (data.result !== "success") {
						this.setState({
							status: "error",
							msg: data.msg
						});
					} else {
						this.setState({
							status: "success",
							msg: data.msg
						});
					}
				}
			)
		);
	};

	render() {
		const { action, messages, className, style, styles } = this.props;
		const { status } = this.state;

		return (
			<div id="subscription-form">
				<div className="container">
					<form action={action} method="post" noValidate className="row">
						<div className="col-xs-10">
							<div className="form-group is-empty has-success">
								<input ref={node => (this.input = node)} type="email" name="EMAIL" placeholder="Enter emailt to receive updates about Nexchange" className="form-control" required />
							<span className="material-input"></span></div>
						</div>

						<div className="col-xs-2">
							<button 
								disabled={
									this.state.status === "sending" ||
									this.state.status === "success"
								}
								type="submit"
								className="btn btn-themed"
								onClick={this.onSubmit}
							>
								Subscribe
							</button>
						</div>

						<div className="col-xs-12 message">
						{status === "success" && (<p className="success">Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.</p>)}
						{status === "error" && (<p className="failure">Something went wrong. Please try again later.</p>)}
						</div>
					</form>
				</div>
			</div>
		);
	}
}

export default SubscriptionForm;