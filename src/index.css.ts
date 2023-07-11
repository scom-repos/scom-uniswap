import { Styles } from '@ijstech/components';
import Assets from './assets';
const Theme = Styles.Theme.ThemeVars;

const colorVar = {
  primaryButton: 'transparent linear-gradient(90deg, #AC1D78 0%, #E04862 100%) 0% 0% no-repeat padding-box',
  primaryGradient: 'linear-gradient(255deg,#f15e61,#b52082)',
  darkBg: '#181E3E 0% 0% no-repeat padding-box',
  primaryDisabled: 'transparent linear-gradient(270deg,#351f52,#552a42) 0% 0% no-repeat padding-box !important'
}

Styles.fontFace({
  fontFamily: "Montserrat Regular",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Regular.ttf')}") format("truetype")`,
  fontWeight: 'nomal',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat Bold",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Bold.ttf')}") format("truetype")`,
  fontWeight: 'bold',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat Light",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Light.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat Medium",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-Medium.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Montserrat SemiBold",
  src: `url("${Assets.fullPath('fonts/montserrat/Montserrat-SemiBold.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Raleway Regular",
  src: `url("${Assets.fullPath('fonts/raleway/Raleway-Regular.ttf')}") format("truetype")`,
  fontWeight: 'nomal',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Raleway Bold",
  src: `url("${Assets.fullPath('fonts/raleway/Raleway-Bold.ttf')}") format("truetype")`,
  fontWeight: 'bold',
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Raleway Light",
  src: `url("${Assets.fullPath('fonts/raleway/Raleway-Light.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Raleway Medium",
  src: `url("${Assets.fullPath('fonts/raleway/Raleway-Medium.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.fontFace({
  fontFamily: "Raleway SemiBold",
  src: `url("${Assets.fullPath('fonts/raleway/Raleway-SemiBold.ttf')}") format("truetype")`,
  fontStyle: 'normal'
})

Styles.cssRule('.uniswap-v3', {
  $nest: {
    'i-icon': {
      display: 'inline-block'
    },
    '::-webkit-scrollbar': {
      width: '3px',

    },
    '::-webkit-scrollbar-thumb': {
      background: Theme.colors.primary.main,
      borderRadius: '5px',
    },
    '*': {
      boxSizing: 'border-box',
    },
    '#swapContainer i-button': {
      fontWeight: 600,
      verticalAlign: 'middle',
      lineHeight: 1.5,
    },
    '#swapContainer i-button.disabled': {
      opacity: 0.4,
    },
    '#swapContainer i-button:not(.disabled):hover': {
      transition: 'all .2s ease-out',
      background: 'linear-gradient(255deg,#f15e61,#b52082)',
      color: Theme.colors.primary.contrastText
    },
    '#swapContainer i-button:focus': {
      outline: 0,
      boxShadow: '0 0 0 0.2rem rgb(0 123 255 / 25%)'
    },
    '#swapContainer': {
      width: 460,
      maxWidth: '100%',
      minHeight: 340,
      padding: '1rem',
      marginInline: 'auto'
    },
    '.bg-box': {
      margin: '0.5rem 0',
      border: '2px solid transparent',
      borderRadius: '1rem',
      $nest: {
        '&.bg-box--active': {
          borderColor: '#E53780'
        }
      }
    },
    '#swapContainer .input--token-box': {
      $nest: {
        '#btnToken': {
          height: 'auto !important'
        },
        'i-button.custom-btn': {
          // background: '#ffffff30',
          padding: '0.5rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: 700,
          lineHeight: 1.5,
          alignSelf: 'center',
          textAlign: 'center',
          opacity: 1,
          color: Theme.input.fontColor,
          $nest: {
            '&:not(.disabled):hover': {
              color: Theme.input.fontColor,
              // background: '#ffffff35'
            },
            '&> span': {
              verticalAlign: 'middle',
            },
            '&> i-icon': {
              maxWidth: 10,
              height: '16px !important',
              opacity: 0.5,
              marginRight: 'unset',
              fill: Theme.input.fontColor,
              $nest: {
                'svg': {
                  fill: `${Theme.input.fontColor} !important`
                }
              }
            },
            '&> :not(:last-child)': {
              marginRight: '0.5rem'
            }
          }
        },
        '.token-input': {
          width: '100%'
        },
        '.token-input > input': {
          width: '100%',
          height: 'auto !important',
          padding: '.375rem .75rem',
          paddingRight: '0.25rem',
          paddingLeft: 0,
          borderRadius: '0.25rem',
          border: 'none',
          background: 'transparent',
          color: Theme.input.fontColor,
          fontSize: '1.5rem'
        }
      }
    },
    '.toggle-reverse': {
      fontSize: '20px',
      textAlign: 'center',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      $nest: {
        '> .icon-swap': {
          display: 'inline-flex',
          padding: '0.25rem',
        },
        '.custom-ic--swap': {
          border: `3px solid ${Theme.background.main}`,
          borderRadius: '25%'
        }
      }
    },
    '.rounded-icon': {
      display: 'inline-flex',
      padding: '3px',
      background: Theme.input.background,
      border: '2px solid transparent',
      borderRadius: '50%',
      cursor: 'pointer'
    },
    '.total-routes': {
      padding: '0.25rem 1rem 0.5rem'
    },
    '.swap-btn-container': {
      marginTop: 10,
      $nest: {
        '.btn-swap': {
          position: 'relative',
          width: '100%',
          borderRadius: '0.65rem',
          fontSize: '1.125rem',
          padding: '0.5rem 0.75rem',
          opacity: 1,
          color: Theme.colors.primary.contrastText
        }
      }
    },
    '#payCol, #receiveCol': {
      maxWidth: 'calc(100% - 9rem)',
    },
    '.price-percent *': {
      color: Theme.colors.secondary.main, // '#f7d063',
      whiteSpace: 'nowrap',
      textAlign: 'right'
    },
    '.cursor-default': {
      cursor: 'default !important',
    },
    '.hidden': {
      display: 'none !important'
    },
    '.custom-modal': {
      $nest: {
        '.modal': {
          background: Theme.background.modal,
          width: 490,
          maxWidth: '100%',
          padding: '0.75rem 1rem',
          borderRadius: '1rem',
          color: Theme.text.primary
        },
        '.i-modal_header': {
          marginBottom: '1.5rem',
          paddingBottom: '0.5rem',
          borderBottom: `2px soid ${Theme.background.main}`,
          color: Theme.colors.primary.main,
          fontSize: '1.25rem',
          fontWeight: 700,
          $nest: {
            '&> span': {
              color: Theme.colors.primary.main,
            },
            '&> i-icon': {
              fill: `${Theme.colors.primary.main} !important`
            },
            '& ~ i-icon': {
              display: 'inline-block',
              margin: '0.75rem 0',
              background: Theme.input.background,
              border: '2px solid transparent',
              borderRadius: '50%',
              padding: '0.25rem'
            }
          }
        },
      }
    },
    '#openswapResult': {
      $nest: {
        '.modal': {
          background: Theme.background.modal,
          width: '440px',
          maxWidth: '100%',
          padding: '0.5rem',
          borderRadius: '12px'
        },
        'i-label:nth-child(2)': {
          marginBottom: '0.25rem'
        },
        '.waiting-txt > *': {
          fontSize: '22px'
        },
        'i-loading': {
          marginTop: '3rem',
          marginBottom: '0.5rem'
        },
        'i-loading .i-loading-spinner_icon': {
          width: '50px',
          height: '48px'
        }
      }
    },
    '.action-setting': {
      margin: 'auto 0 0 auto',
      $nest: {
        '> i-icon': {
          marginLeft: '0.5rem'
        },
        '> i-label': {
          opacity: 0.75
        }
      }
    },
    '.btn-os': {
      background: colorVar.primaryButton,
      color: Theme.text.primary,
      transition: 'background .3s ease',
      fontSize: '1rem',
      fontWeight: 'bold',
      fontFamily: 'Raleway Bold',
      $nest: {
        'i-icon.loading-icon': {
          marginInline: '0.25rem',
          width: '16px !important',
          height: '16px !important',
        },
        'i-icon.is-spin': {
          fill: Theme.colors.primary.contrastText,
          $nest: {
            'svg': {
              fill: Theme.colors.primary.contrastText
            }
          }
        }
      },
    },
    '.btn-os:not(.disabled):not(.is-spinning):hover, .btn-os:not(.disabled):not(.is-spinning):focus': {
      background: colorVar.primaryGradient,
      backgroundColor: 'transparent',
      boxShadow: 'none',
      opacity: .9
    },
    '.btn-os:not(.disabled):not(.is-spinning):focus': {
      boxShadow: '0 0 0 0.2rem rgb(0 123 255 / 25%)'
    },
    '.btn-os.disabled, .btn-os.is-spinning': {
      background: colorVar.primaryDisabled,
      opacity: 1
    },
    '.dark-bg': {
      background: colorVar.darkBg,
      borderRadius: 5
    },
    '.btn-transparent, .btn-transparent:not(.disabled):focus, .btn-transparent:not(.disabled):hover': {
      background: 'transparent',
      boxShadow: 'none',
      backgroundColor: 'transparent'
    }
  }
})
