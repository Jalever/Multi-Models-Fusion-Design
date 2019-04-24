import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';

import Link from 'umi/link';

import { Checkbox, Alert, message, Icon } from 'antd';

import Login from '@/components/Login';

import styles from './Login.less';

const {
  Tab, // @/components/index.js 文件中Login.Tab = LoginTab，可以理解为加载的组件为LoginTab.js
  Submit, // @/components/index.js 文件中Login.Submit = LoginSubmit，可以理解为加载的组件为LoginSubmit.js
  //以下为LoginItem的组件
  UserName,
  Password,
  Mobile,
  Captcha,
  Environment,
} = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))

//登录页面
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  handleTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);

          message.warning(formatMessage({ id: 'app.login.verification-code-warning' }));
        }
      });
    });

  //点击“登录”按钮
  handleSubmit = (err, values) => {
    const { type } = this.state;

    if (!err) {
      const { dispatch } = this.props;

      // console.log("values");
      // console.log(values);
      // console.log("\n");

      // dispatch({
      //     type: 'login/login',
      //     payload: {
      //         ...values,
      //         type,
      //     }
      // });

      // console.log("values");
      // console.log(values);
      // console.log("\n");
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;

    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          handleTabChange={this.handleTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          {/* 账户密码登录 */}
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              login.type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}

            {/* 用户名输入框 */}
            <UserName
              name="userName"
              placeholder={formatMessage({ id: 'app.login.userName' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.userName.required' }),
                },
              ]}
            />

            {/* 密码输入框 */}
            <Password
              name="password"
              placeholder={formatMessage({
                id: 'app.login.password',
              })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.password.required' }),
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                // this.loginForm.validateFields(this.handleSubmit);
              }}
            />

            {/* 环境下拉框 */}
            <Environment
              name="environment"
              placeholder={formatMessage({ id: 'app.login.environment' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.environment.required' }),
                },
              ]}
            />
          </Tab>

          {/* 手机号登录 */}
          <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
            {login.status === 'error' &&
              login.type === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'app.login.message-invalid-verification-code' })
              )}

            <Mobile
              name="mobile"
              placeholder={formatMessage({ id: 'form.phone-number.placeholder' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.phone-number.required' }),
                },
                {
                  pattern: /^1\d{10}$/,
                  message: formatMessage({ id: 'validation.phone-number.wrong-format' }),
                },
              ]}
            />

            <Captcha
              name="captcha"
              placeholder={formatMessage({ id: 'form.verification-code.placeholder' })}
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
              getCaptchaButtonText={formatMessage({ id: 'form.get-captcha' })}
              getCaptchaSecondText={formatMessage({ id: 'form.captcha.second' })}
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'validation.verification-code.required' }),
                },
              ]}
            />
          </Tab>

          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>

            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div>

          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>

          <div className={styles.other}>
            {/*
                    <FormattedMessage id="app.login.sign-in-with" />
                    <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
                    <Icon type="taobao-circle" className={styles.icon} theme="outlined" />

                    <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
                    */}

            <Link className={styles.register} to="/user/register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
