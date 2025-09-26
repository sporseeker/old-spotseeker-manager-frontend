// ** React Imports
import { useRef, useState, useEffect } from 'react'
import { useImmer } from 'use-immer'
// ** Actions
//import { handleProductDataChange, handlePackageDataChange } from '@store/productmgt'

// ** Custom Components
import Wizard from '@components/wizard'

// ** Steps
import Settings from './steps/Settings'
import BasicDetails from './steps/BasicDetails'
import PackageDetails from './steps/PackageDetails'
import EventService from '../../../../services/EventService'
import { Alert } from '../../../../utility/alerts'
import PromotionDetails from './steps/PromotionDetails'
import { EditorState, convertFromRaw } from 'draft-js'
import SpinnerComponent from '../../../../@core/components/spinner/Fallback-spinner'
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { Button, Col, Row } from 'reactstrap'
import Features from './steps/Features'
import { Command } from 'react-feather'

const MySwal = withReactContent(Swal)

const ProductCreateWizard = ({type, id}) => {

  // ** Ref
  const ref = useRef(null)

  // ** State
  const [stepper, setStepper] = useState(null)
  const [productData, setProductData] = useImmer({
    name: '',
    description: '',
    organizer: '',
    manager: '',
    start_date: '',
    end_date: '',
    type: '',
    sub_type: '',
    featured: false,
    free_seating: true,
    venue: '',
    invoice: [
      {
        packageName: "",
        packageDesc: "",
        packagePrice: "",
        packageQty: "",
        packageAvailQty: "",
        packageResQty: "",
        packageAllocSeats: "",
        packageAvailSeats: "",
        packageFreeSeating: true,
        sold_out: false,
        promotions: false,
        promotion: [
          {
            promoCode: "",
            discAmount: "",
            discAmtIsPercentage: true,
            isPerTicket: false,
            minTickets: "",
            minAmount: "",
            maxTickets: "",
            maxAmount: "",
            startDateTime: "",
            endDateTime: "",
            isAutoApply: false,
            redeems: ""
          }
        ],
        active: true,
        deleted: false,
        maxBuyTickets: 0
      }
    ],
    banner_img: '',
    thumbnail_img : '',
    sold_out_msg: '',
    handling_cost: "",
    handling_cost_perc: false,
    ftype: 'create',
    currency: '',
    invitation_feature: false,
    invitation_count: '',
    invitation_packages: [
      {
        packageName: "",
        packageDesc: "",
        packageQty: "",
        packageAvailQty: "",
        packageSoldQty: "",
        packageAllocSeats: "",
        active: true,
        deleted: false,
        packageFreeSeating: true
      }
    ],
    addons_feature: false,
    addons: [
      {
        addonName: "",
        addonImage: "",
        addonCategory: "",
        addonPrice: "",
        deleted: false
      }
    ],
    trailer_url: ""
  })
  const [editorValue, setEditorValue] = useState(EditorState.createEmpty())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    if (type === "edit") {
      EventService.getEvent(id)
      .then(res => {
        const event = res.data.data

        const packages = []
        const invitationPackages = []
        let packagePromos = []
        const eventAddons = []

        event.ticket_packages.filter(tp => tp.private === false).map(tpackage => {
          packagePromos = []
          tpackage.promotions.map(promotion => {
            const promo = {
              promoId: promotion.id,
              promoCode: promotion.coupon_code,
              discAmount: promotion.discount_amount,
              discAmtIsPercentage: promotion.percentage,
              isPerTicket: promotion.per_ticket,
              minTickets: promotion.min_tickets,
              minAmount: promotion.min_amount,
              maxTickets: promotion.max_tickets,
              maxAmount: promotion.max_amount,
              startDateTime: promotion.start_date,
              endDateTime: promotion.end_date,
              isAutoApply: promotion.auto_apply,
              redeems: promotion.redeems
            }
  
            packagePromos.push(promo)
          })

          const initPromo = [
            {
              promoCode: "",
              discAmount: "",
              discAmtIsPercentage: true,
              isPerTicket: false,
              minTickets: "",
              minAmount: "",
              maxTickets: "",
              maxAmount: "",
              startDateTime: "",
              endDateTime: ""
            }
          ]

          const tpackage_obj = {
            packageId: tpackage.id,
            packageName: tpackage.name,
            packageDesc: tpackage.desc,
            packagePrice: tpackage.price,
            packageQty: tpackage.tot_tickets,
            packageAvailQty: tpackage.aval_tickets,
            packageSoldQty: tpackage.sold_tickets ? tpackage.sold_tickets : "",
            packageResQty: tpackage.res_tickets,
            packageAllocSeats: tpackage.seating_range ? tpackage.seating_range.toString() : "",
            packageAvailSeats: tpackage.available_seats ? tpackage.available_seats.toString() : "",
            packageFreeSeating: tpackage.free_seating,
            sold_out: tpackage.sold_out,
            promotions: tpackage.promotions.length > 0,
            promotion: packagePromos.length > 0 ? packagePromos : initPromo,
            active: tpackage.active,
            deleted: false,
            maxBuyTickets: tpackage.max_tickets_can_buy
          }
          packages.push(tpackage_obj)
        })

        event.ticket_packages.filter(tp => tp.private === true).map(tpackage => {

          const tpackage_obj = {
            packageId: tpackage.id,
            packageName: tpackage.name,
            packageDesc: tpackage.desc,
            packagePrice: tpackage.price,
            packageQty: tpackage.tot_tickets,
            packageAvailQty: tpackage.aval_tickets,
            packageSoldQty: tpackage.sold_tickets ? tpackage.sold_tickets : "",
            packageResQty: tpackage.res_tickets,
            packageAllocSeats: tpackage.seating_range ? tpackage.seating_range.toString() : "",
            packageAvailSeats: tpackage.available_seats ? tpackage.available_seats.toString() : "",
            packageFreeSeating: tpackage.free_seating,
            sold_out: tpackage.sold_out,
            promotions: false,
            promotion: null,
            active: tpackage.active,
            deleted: false,
            maxBuyTickets: tpackage.max_tickets_can_buy
          }
          invitationPackages.push(tpackage_obj)
        })

        const initInvitationPackage = [
          {
            packageName: "",
            packageDesc: "",
            packageQty: "",
            packageAvailQty: "",
            packageSoldQty: "",
            packageAllocSeats: "",
            active: true,
            deleted: false,
            packageFreeSeating: true
          }
        ]

        const initAddon = [
          {
            addonName: "",
            addonImage: "",
            addonPrice: "",
            addonCategory: "",
            deleted: false
          }
        ]

        if (event.addons_feature) {
          event.addons.map(addon => {
            eventAddons.push({
              addonId: addon.id,
              addonName: addon.name,
              addonImage: addon.image_url,
              addonPrice: addon.price,
              addonCategory: addon.category,
              deleted: false
            })
          })
        } 

        setProductData({
          id: event.id,
          name: event.name,
          description: event.json_desc,
          organizer: event.organizer,
          manager: event.manager,
          start_date: event.start_date,
          end_date: event.end_date,
          type: event.type,
          sub_type: event.sub_type,
          featured: event.featured,
          free_seating: event.free_seating,
          venue: event.venue.id,
          invoice: packages,
          banner_img: event.banner_img,
          thumbnail_img: event.thumbnail_img,
          status: event.status,
          sold_out_msg: event.message,
          handling_cost: event.handling_cost,
          handling_cost_perc: event.handling_cost_perc,
          ftype: 'edit',
          currency: event.currency,
          invitation_feature: event.invitation_feature,
          invitation_count: event.invitation_count,
          invitation_packages: invitationPackages.length > 0 ? invitationPackages : initInvitationPackage,
          addons_feature: event.addons_feature,
          addons: event.addons_feature ? eventAddons : initAddon,
          trailer_url: event.trailer_url
        })

        if (event.json_desc !== null) { 
        //const editorState = EditorState.createWithContent(contentState.getCurrentContent())
          //setEditorValue(editorState)
          const contentState = convertFromRaw((JSON.parse(event.json_desc)))

        const editorState = EditorState.createWithContent(contentState)
          setEditorValue(editorState)
        }
        setLoading(false)
      }).catch(err => {
        setLoading(false)
        console.log(err)
      })
    } else {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (productData.invitation_packages.length === 0) {
      setProductData((product) => {
        product.invitation_feature = false
      })
    }
  }, [productData.invitation_packages])

  useEffect(() => {
    if (productData.addons.length === 0) {
      setProductData((product) => {
        product.addons_feature = false
      })
    }
  }, [productData.addons])

  const handleChange = (e, index = null, type = 'pack') => {
    const { name, value } = e.target
    if (index !== null) {
        if (type === 'pack') {
          setProductData(product => {
            product.invoice[index][name] = value
          })
        } else {
          setProductData(product => {
            product.invitation_packages[index][name] = value
          })
        }
    } else {
      setProductData(product => {
        product[name] = value
      })
    }
  }

  const handleDropdownChange = (option, action, index = null, type = 'pack') => {
    
    if (type === 'pack') {
      setProductData(prevState => ({
        ...prevState,
        [action.name]: option.value
      }))
    } else {
      setProductData(product => {
        product.invitation_packages[index][action.name] =  option.value
      })
    }
  }

  const handlePackageFreeSeatingChange = (option, action) => {
    setProductData(product => {
      product.invoice[action.name.split("-")[1]]["packageFreeSeating"] = option.value
    })
  }

  const handlePackageActiveChange = (option, action) => {
    if (action.name.includes('soldout')) {
      setProductData(product => {
        product.invoice[action.name.split("-")[1]]["sold_out"] = option.value
      })
    } else {
      setProductData(product => {
        product.invoice[action.name.split("-")[1]]["active"] = option.value
      })
    }
    
  }

  const handleFileChange = (e) => {
    const { name, files } = e.target

    setProductData(prevState => ({
      ...prevState,
      [name]: files[0]
    }))
  }

  const handleStartDateChange = date => {
    setProductData(prevState => ({
      ...prevState,
      start_date: date
    }))
  }

  const handleEndDateChange = date => {
    setProductData(prevState => ({
      ...prevState,
      end_date: date
    }))
  }

  const handlePackageAdd = (index = null) => {
    if (index !== null) {
      setProductData(product => {
        product.invoice[index]["deleted"] = false
      })
    } else {
      const packageDataObj = {
        packageName: "",
        packageDesc: "",
        packagePrice: "",
        packageQty: "",
        packageAvailQty: "",
        packageSoldQty: "",
        packageResQty: "",
        packageAllocSeats: "",
        packageAvailSeats: "",
        packageFreeSeating: true,
        promotions: false,
        promotion: [
          {
            promoCode: "",
            discAmount: "",
            discAmtIsPercentage: true,
            isPerTicket: false,
            minTickets: "",
            minAmount: "",
            maxTickets: "",
            maxAmount: "",
            startDateTime: "",
            endDateTime: "",
            isAutoApply: false,
            redeems: ""
          }
        ],
        active: true,
        sold_out: false,
        maxBuyTickets: 0,
        deleted: false
      }
  
      setProductData({
        ...productData,
        invoice: [
          ...productData.invoice,
          packageDataObj
        ]
      })
    }
  }

  const handlePackageRemove = (index) => {
    const prodObjs = [...productData.invoice]
    if (prodObjs[index].packageId) {
      setProductData(product => {
        product.invoice[index]["deleted"] = true
      })
    } else {
      prodObjs.splice(index, 1)
      setProductData(product => {
        product.invoice = prodObjs
      })
    }
  }

  const handlePromotionStatus = (index, value, type) => {

    if (index !== null) {
      setProductData(product => {
        product.invoice[index][type] = value
      })
    } else {
      setProductData(product => {
        product[type] = value
      })
    }    
  }

  const handlePromoStartDate = (index, promoIndex, date) => {
    setProductData(product => {
      product.invoice[index].promotion[promoIndex].startDateTime = date
    })
  }

  const handlePromoEndDate = (index, promoIndex, date) => {
    setProductData(product => {
      product.invoice[index].promotion[promoIndex].endDateTime = date
    })
  }

  const handlePromoChange = (e, index = null, promoIndex) => {
    const { name, value } = e.target
    if (index !== null) {
      setProductData(product => {
        product.invoice[index]["promotion"][promoIndex][name] = value
      })
    } else {
      name = name.split("-")[0]
      setProductData(product => {
        product[name] = value
      })
    }
  }

  const handlePromoDropdownChange = (option, action) => {
    const promoIndex = action.name.split("-")[2]
    const index = action.name.split("-")[1]
    const name = action.name.split("-")[0]
    setProductData(product => {
      product.invoice[index]["promotion"][promoIndex][name] = option.value
    })
  }

  const handleEditorChange = (data) => {
    setProductData(product => {
      product['description'] = JSON.stringify(data)
    })
  }

  const handleEditor = (data) => {
    setEditorValue(data)
  }

  const handleInvitationPackageAdd = (index = null) => {

    if (index !== null) {
      setProductData(product => {
        product.invitation_packages[index]["deleted"] = false
      })
    } else {
      const packageDataObj = {
        packageName: "",
        packageDesc: "",
        packageQty: "",
        packageAvailQty: "",
        packageSoldQty: "",
        packageAllocSeats: "",
        active: true,
        deleted: false,
        packageFreeSeating: true
      }
  
      setProductData({
        ...productData,
        invitation_packages: [
          ...productData.invitation_packages,
          packageDataObj
        ]
      })
    }
    
  }

  const handleInvitationPackageRemove = (index) => {
    const prodObjs = [...productData.invitation_packages]
    console.log(prodObjs)
    if (prodObjs[index].packageId) {
      console.log(prodObjs[index])
      setProductData(product => {
        product.invitation_packages[index]["deleted"] = true
      })
    } else {
      prodObjs.splice(index, 1)
      setProductData(product => {
        product.invitation_packages = prodObjs
      })
    }
  }

  const handleAddonAdd = (index = null) => {

    if (index !== null) {
      setProductData(product => {
        product.addons[index]["deleted"] = false
      })
    } else {
      const addonDataObj = {
        addonName: "",
        addonImage: "",
        addonPrice: "",
        addonCategory: "",
        deleted: false
      }
  
      setProductData({
        ...productData,
        addons: [
          ...productData.addons,
          addonDataObj
        ]
      })
    }
    
  }

  const handleAddonRemove = (index) => {
    const prodObjs = [...productData.addons]

    if (prodObjs[index].addonId) {
      console.log(prodObjs[index])
      setProductData(product => {
        product.addons[index]["deleted"] = true
      })
    } else {
      prodObjs.splice(index, 1)
      setProductData(product => {
        product.addons = prodObjs
      })
    }
  }

  const handleAddonInputChange = (e, index, type = 'input', option = null, action = null) => {
    if (type === 'file') {

      const { name, files } = e.target

        setProductData(product => {
          product.addons[index][name] = files[0]
        })
      
    } else if (type === 'select') {
      const index = action.name.split("-")[1]
      const name = action.name.split("-")[0]
      setProductData(product => {
        product.addons[index][name] = option.value
      })
    } else {
      const { name, value } = e.target
        setProductData(product => {
          product.addons[index][name] = value
        })
    }
    
    
  }

  const steps = [
    {
      id: 'basic-details',
      title: 'Basic Details',
      content: <BasicDetails stepper={stepper} type='wizard-vertical' handleStartDateChange={handleStartDateChange} handleEndDateChange={handleEndDateChange} handleChange={handleChange} handleDropdownChange={handleDropdownChange} handleFileChange={handleFileChange} productData={productData} handleEditor={handleEditor} handleEditorChange={handleEditorChange} editorValue={editorValue}/>
    },
    {
      id: 'package-details',
      title: 'Packages',
      content: <PackageDetails stepper={stepper} type='wizard-vertical' handleChange={handleChange} handleFileChange={handleFileChange} handlePackageAdd={handlePackageAdd} handlePackageRemove={handlePackageRemove} productData={productData} handleDropdownChange={handlePackageFreeSeatingChange} handlePackageActiveChange={handlePackageActiveChange}/>
    },
    {
      id: 'promo-details',
      title: 'Promotions',
      content: <PromotionDetails stepper={stepper} type='wizard-vertical' handlePromoChange={handlePromoChange} handlePromoDropdownChange={handlePromoDropdownChange} handleFileChange={handleFileChange} handlePackageAdd={handlePackageAdd} handlePackageRemove={handlePackageRemove} productData={productData} handleDropdownChange={handlePackageFreeSeatingChange} handlePromotionStatus={handlePromotionStatus} handlePromoStartDate={handlePromoStartDate} handlePromoEndDate={handlePromoEndDate}/>
    },
    {
      id: 'settings-details',
      title: 'Settings',
      content: <Settings stepper={stepper} type='wizard-vertical' handleChange={handleChange} productData={productData} handlePromotionStatus={handlePromotionStatus}/>
    },
    {
      id: 'features-details',
      title: 'Features',
      content: <Features stepper={stepper} type='wizard-vertical' handleChange={handleChange} productData={productData} handleInvitationPackageAdd={handleInvitationPackageAdd} handleInvitationPackageRemove={handleInvitationPackageRemove} handlePromotionStatus={handlePromotionStatus} handleDropdownChange={handleDropdownChange} handleAddonAdd={handleAddonAdd} handleAddonRemove={handleAddonRemove} handleAddonInputChange={handleAddonInputChange}/>
    }
  ]

  return (
    <div className='vertical-wizard'>
      { loading ? <SpinnerComponent/> : <Wizard
        type='vertical'
        ref={ref}
        steps={steps}
        options={{
          linear: false
        }}
        instance={el => setStepper(el)}
      />}
      
    </div>
  )
}

export default ProductCreateWizard
