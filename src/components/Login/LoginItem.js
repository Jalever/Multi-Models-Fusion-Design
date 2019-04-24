import React, { Component } from 'react';

import { Form, Input, Button, Select, Row, Col } from 'antd';
const Option = Select.Option;

//omit.js: Utility function to create a shallow copy of an object which had dropped some fields.
import omit from 'omit.js';
import styles from './index.less';
import ItemMap from './map';
import LoginContext from './loginContext';

const FormItem = Form.Item;

class WrapFormItem extends Component {
  static defaultProps = {
    getCaptchaButtonText: 'captcha',
    getCaptchaSecondText: 'second',
  };

  constructor(props) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  componentDidMount() {
    const { updateActive, name } = this.props;

    if (updateActive) {
      updateActive(name);
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { onGetCaptcha } = this.props;

    const result = onGetCaptcha ? onGetCaptcha() : null;

    if (result === false) {
      return;
    }

    if (result instanceof Promise) {
      result.then(this.runGetCaptchaCountDown);
    } else {
      this.runGetCaptchaCountDown();
    }
  };

  // 设置onChange监听事件, initialValue初始值, 自定义的props(./map.js中), rules(./map.js中)
  getFormItemOptions = ({ onChange, defaultValue, customprops, rules }) => {
    // console.log("onChange");
    // console.log(onChange);
    // console.log("\n");

    const options = {
      rules: rules || customprops.rules,
    };

    if (onChange) {
      options.onChange = onChange;
    }

    if (defaultValue) {
      options.initialValue = defaultValue;
    }

    return options;
  };

  //发送验证码countdown
  runGetCaptchaCountDown = () => {
    const { countDown } = this.props;
    let count = countDown || 59;
    this.setState({ count });
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({ count });
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  };

  render() {
    const { count } = this.state;

    // 这么写是为了防止restProps中 带入 onChange, defaultValue, rules props
    const {
      onChange,
      defaultValue,

      name,
      getCaptchaButtonText,
      getCaptchaSecondText,

      customprops, //Login/map.js中的props
      rules,
      type,
      updateActive,
      ...restProps
    } = this.props;

    // console.log("customprops");
    // console.log(customprops);
    // console.log("\n");

    const {
      form: { getFieldDecorator },
    } = this.props;

    // 设置onChange监听事件, initialValue初始值, 自定义的props(./map.js中), rules(./map.js中)
    const options = this.getFormItemOptions(this.props);
    // console.log("options");
    // console.log(options);
    // console.log("\n");
    // console.log("this.props");
    // console.log(this.props);
    // console.log("\n");

    //page/Users/Login.js中的props
    const otherProps = restProps || {};

    const selectOptions = customprops.selectOptions || [];

    // console.log("this.props");
    // console.log(this.props);
    // console.log("\n");

    if (type === 'Captcha') {
      const inputProps = omit(otherProps, ['onGetCaptcha', 'countDown']);
      return (
        <FormItem>
          <Row gutter={8}>
            {
              <Col span={16}>
                {getFieldDecorator(name, options)(<Input {...customprops} {...inputProps} />)}
              </Col>
            }

            {
              <Col span={8}>
                <Button
                  disabled={count}
                  className={styles.getCaptcha}
                  size="large"
                  onClick={this.onGetCaptcha}
                >
                  {count ? `${count} ${getCaptchaSecondText}` : getCaptchaButtonText}
                </Button>
              </Col>
            }
          </Row>
        </FormItem>
      );
    } else if (type === 'Environment') {
      return (
        <FormItem>
          {getFieldDecorator(name, options)(
            <Select {...customprops} {...otherProps}>
              {selectOptions.map(item => {
                return (
                  <Option key={item.key} value={item.value}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          )}
        </FormItem>
      );
    }
    return (
      <FormItem>
        {getFieldDecorator(name, options)(<Input {...customprops} {...otherProps} />)}
      </FormItem>
    );
  }
}

const LoginItem = {};
Object.keys(ItemMap).forEach(key => {
  const item = ItemMap[key];

  //这个curValue的值是从哪里来的？
  LoginItem[key] = curValue => {
    console.warn('curValue --- components/Login/LoginItem');
    console.log(curValue);
    console.log('\n');

    return (
      <LoginContext.Consumer>
        {context => (
          <WrapFormItem
            customprops={item.props}
            rules={item.rules}
            {...curValue}
            type={key}
            updateActive={context.updateActive}
            form={context.form}
          />
        )}
      </LoginContext.Consumer>
    );
  };
});

export default LoginItem;
