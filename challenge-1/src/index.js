'use strict'

/** HELPERS */
/** query :: String -> HTMLElement -> HTMLElement */
const query = query => element => element.querySelector(query)

/** queryAll :: String -> HTMLElement -> [HTMLElement] */
const queryAll = query => element => Array.from(element.querySelectorAll(query))

/** getActiveStep :: () -> HTMLElement */
const getActiveStep = () => query('.active')(window.document)

/** getSteps :: () -> [HTMLElement] */
const getSteps = () => queryAll('.step-form > .step')(window.document)

/** getInput :: HTMLElement -> HTMLElement */
const getInput = query('input')

/** getAllInput :: () -> [HTMLElement] */
const getAllInputs = () => queryAll('input')(window.document)

/** isConfirmStep :: HTMLElement -> Boolean */
const isConfirmStep = step => step.getAttribute('id') === 'confirm'

/** isActive :: HTMLElement -> Boolean */
const isActive = element =>
  Boolean(element.getAttribute('class').match(/active/))

/** setActive :: Number -> () -> undefined */
const setActive = direction => () => {
  const steps = getSteps()
  const activeIndex = steps.findIndex(isActive)

  steps.forEach((step, i) => {
    const classes = step.getAttribute('class')
    i === activeIndex + direction
      ? step.setAttribute('class', `${classes} active`)
      : step.setAttribute('class', classes.replace('active', ''))
  })
  const stepsFirstInput = getInput(getActiveStep())
  if (stepsFirstInput != null) {
    stepsFirstInput.focus()
  }
}

/** setNextActive :: () -> undefined */
const setNextActive = setActive(1)

/** setPrevActive :: () -> undefined */
const setPrevActive = setActive(-1)

/** handleActiveStep :: () -> undefined */
const handleActiveStep = () => {
  const active = getActiveStep()
  const submitBtn = query('button[type="submit"]')(active)
  const prevBtn = query('button[type="reset"]')(active)

  const handleEvent = effect => e => {
    e.preventDefault()
    submitBtn.removeEventListener('click', onSubmit)
    prevBtn && prevBtn.removeEventListener('click', onPrev)
    effect()
    handleActiveStep()
  }

  const onSubmit = handleEvent(setNextActive)
  const onPrev = handleEvent(setPrevActive)

  if (isConfirmStep(active)) {
    queryAll('.value')(active).forEach(
      (field, i) => (field.innerText = getAllInputs()[i].value)
    )
    const submitForm = handleEvent(() =>
      console.log(
        'Form:',
        getAllInputs().reduce(
          (formData, field) => ({ ...formData, [field.name]: field.value }),
          {}
        )
      )
    )

    submitBtn.addEventListener('click', submitForm)
  } else {
    submitBtn.addEventListener('click', onSubmit)
  }
  prevBtn && prevBtn.addEventListener('click', onPrev)
}

handleActiveStep()
