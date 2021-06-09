import { Menu } from 'antd'
import routes from '../../constants/routes'
import React from 'react'
import { matchPath, useHistory, useLocation } from 'react-router-dom'
import styles from './index.module.scss'

const menuConfig = [
    {
      key: routes.POKEMON,
      label: 'Pokemon List',
    },
    {
      key: routes.MYPOKEMON,
      label: 'My Pokemon List',
    },
]

function Header() {
  const history = useHistory()
  const location = useLocation()

  const onClick = ({ key }) => {
    history.push(key)
  }

  return (
    <div className={styles.container}>
      <Menu
        theme="dark"
        mode="horizontal"
        selectable={false}
        selectedKeys={menuConfig
          .filter(({ key }) => matchPath(location.pathname, key)?.isExact)
          ?.map(({ key }) => key)}
        onClick={onClick}>
        {menuConfig.map(({ key, label }) => (
          <Menu.Item key={key}>{label}</Menu.Item>
        ))}
      </Menu>
    </div>
  )
}

export default Header