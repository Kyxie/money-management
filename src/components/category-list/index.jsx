import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon, NumberKeyboard, Calendar, ConfigProvider } from 'react-vant'
import { getMonthWord } from 'utils/base'
// import locale from './enUs'
import style from './style.module.scss'

export const CategoryList = (props) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const { list, type, onFinish } = props
  const [category, setCategory] = useState('')
  const [numStr, setNumStr] = useState('')
  const [date, setDate] = useState(new Date())
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [showDate, setShowDate] = useState(false)

  const clearSearchParams = () => {
    setSearchParams({ ...searchParams.delete('selected') })
  }

  const handleClickIcon = (icon) => {
    if (searchParams.get('id')) {
      setSearchParams({ id: searchParams.get('id'), selected: icon.name, category: icon.desc })
    } else {
      setSearchParams({ selected: icon.name })
      setShowKeyboard(true)
    }
    setCategory(icon.desc)
  }
  const handleSelectDate = (param) => {
    setDate(param)
    setShowDate(false)
  }
  const handleKeyboardChange = (value) => {
    if (
      value.indexOf('.') !== value.length - 1 &&
      value[value.length - 1] === '.'
    ) {
      setNumStr(value.slice(0, value.length - 1))
      return
    }
    if (!isNaN(value) || value === '.') {
      setNumStr(value)
      console.log(value)
    } else {
      setShowDate(true)
    }
  }
  const handlDateClose = () => {
    setShowDate(false)
  }
  const handleKeyboardBlur = () => {
    if (!showDate) {
      setShowKeyboard(false)
      setNumStr('')
      clearSearchParams()
    }
  }
  const handleEnter = () => {
    if (numStr) {
      const param = {
        amount: Number(numStr),
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        type: type,
        category: category,
        icon: searchParams.get('selected')
      }
      onFinish(param)
      clearSearchParams()
    }
  }

  return (
    <div className={style['list-wrapper']}>
      {list.map((item, index) => {
        return (
          <div key={index} className={style['icon-block']}>
            <div
              data-testid="cart-o"
              className={
                searchParams.get('selected') === item.name ? (
                  `${style.icon} ${style.active}`
                ) : (
                  `${style.icon}`
                )
              }
              onClick={() => handleClickIcon(item)}>
              <Icon name={item.name} />
            </div>
            <p>{item.desc}</p>
          </div>
        )
      })}
      <div
        className={style['amount-popup']}
        style={showKeyboard ? { display: 'block' } : { visibility: 'hidden' }}>
        <div className={style['amount-wrapper']} data-testid="amount">
          Amount: ${numStr}
        </div>
      </div>
      <NumberKeyboard
        theme="custom"
        extraKey={['.', '☆']}
        closeButtonText="Enter"
        value={numStr}
        onChange={handleKeyboardChange}
        visible={showKeyboard}
        onBlur={handleKeyboardBlur}
        onClose={handleEnter}
        safeAreaInsetBottom={true}
        zIndex={3000}
      />
      <ConfigProvider>
        <div data-testid="calendar">
          <Calendar
            visible={showDate}
            onClose={() => {
              handlDateClose()
            }}
            weekdays={['Sun.', 'Mon.', 'Tue.', 'Wed.', 'Thur.', 'Fri.', 'Sat']}
            formatMonthTitle={(date) =>
              date.getFullYear() + '  ' + getMonthWord(date.getMonth() + 1)}
            confirmText={'Confirm'}
            cancelButtonText={'  '}
            title={'Calendar'}
            onConfirm={handleSelectDate}
            minDate={new Date(new Date().getFullYear() - 2, 1, 0)}
            maxDate={new Date()}
          />
        </div>
      </ConfigProvider>
    </div>
  )
}
