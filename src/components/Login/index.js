import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Form, Tabs } from 'antd';

import cx from 'classnames';

import LoginItem from './LoginItem';
import LoginTab from './LoginTab';
import LoginSubmit from './LoginSubmit';

import styles from './index.less';
import LoginContext from './loginContext';

class Login extends Component {
  static propTypes = {
    className: PropTypes.string,
    defaultActiveKey: PropTypes.string,
    handleTabChange: PropTypes.func,
    onSubmit: PropTypes.func,
  };

  static defaultProps = {
    className: '',
    defaultActiveKey: '',
    handleTabChange: () => {},
    onSubmit: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      type: props.defaultActiveKey,
      tabs: [],
      active: {},
    };
  }

  //点击登陆页面上的tab时切换事件
  handleSwitch = type => {
    this.setState({
      type,
    });

    //父组件src/pages/User/Login.js传值
    const { handleTabChange } = this.props;

    handleTabChange(type);
  };

  //创建Context API，供子组件使用
  getContext = () => {
    const { tabs } = this.state;

    const { form } = this.props; // atnd 中自带的form属性

    return {
      //操作tab的方法集合
      tabUtil: {
        addTab: id => {
          this.setState({
            tabs: [...tabs, id],
          });
        },
        removeTab: id => {
          this.setState({
            tabs: tabs.filter(currentId => currentId !== id),
          });
        },
      },

      // atnd 中自带的form属性
      form,

      //更新被选中的input
      updateActive: activeItem => {
        const {
          type, //activeKey[account, mobile]
          active,
        } = this.state;

        if (active[type]) {
          active[type].push(activeItem);
        } else {
          active[type] = [activeItem];
        }
        this.setState({
          active,
        });
      },
    };
  };

  //调用父组件onSubmit事件
  handleSubmit = e => {
    e.preventDefault();

    const { active, type } = this.state;
    // console.log("type");
    // console.log(type);
    // console.log("\n");

    const { form, onSubmit } = this.props;

    //被选中的tab
    const activeFields = active[type];
    //
    // console.log("activeFields -- index.js");
    // console.log(activeFields);
    // console.log("\n");

    form.validateFields(activeFields, { force: true }, (err, values) => {
      console.log('values -- index.js');
      console.log(values);
      console.log('\n');

      onSubmit(err, values);
    });
  };

  render() {
    const { className, children } = this.props;

    const { type, tabs } = this.state;

    //children为标签tab
    const TabChildren = [];
    //children不是标签tab
    const otherChildren = [];

    //Login组件包含的子组件：账户密码tab，手机号tab，自动登录&忘记密码div，登录submit按钮，注册账户div
    //path: src/pages/User/Login.js
    React.Children.forEach(children, item => {
      // console.log("children");
      // console.log(children);
      // console.log("\n");

      if (!item) {
        return;
      }

      if (item.type.typeName === 'LoginTab') {
        //children为标签tab
        TabChildren.push(item);
      } else {
        //children不是标签tab
        otherChildren.push(item);
      }
    });

    return (
      <LoginContext.Provider value={this.getContext()}>
        {
          <div className={cx(className, styles.login)}>
            {
              <Form onSubmit={this.handleSubmit}>
                {tabs.length ? (
                  <React.Fragment>
                    {/* 标签tab */}
                    {
                      <Tabs
                        animated={false}
                        className={styles.tabs}
                        activeKey={type}
                        onChange={this.handleSwitch}
                      >
                        {/* 渲染tabchildren数组中的数据 */}
                        {TabChildren}
                      </Tabs>
                    }

                    {otherChildren}
                  </React.Fragment>
                ) : (
                  children
                )}
              </Form>
            }
          </div>
        }
      </LoginContext.Provider>
    );
  }
}

Login.Tab = LoginTab;
Login.Submit = LoginSubmit;
Object.keys(LoginItem).forEach(item => {
  // console.log("LoginItem");
  // console.log(LoginItem);
  // console.log("\n");
  Login[item] = LoginItem[item];
});

export default Form.create()(Login);
