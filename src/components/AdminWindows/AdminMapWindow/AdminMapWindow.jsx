import { useEffect, useState } from "react";
import styles from "./AdminMapWindow.module.css"
import mapService from "../../../services/mapService";
import { districtsAdminArray } from "./districtsAdminArray";

const AdminMapWindow = () => {
    const [loading, setLoading] = useState(false)
    const [organizations, setOrganizations] = useState([])
    const [currentDistrict, setCurrentDistrict] = useState(null)
    const [currentArea, setCurrentArea] = useState(null)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [organization, setOrganization] = useState({
        head_text: "",
        is_head: false,
        director: "",
        phone: "",
        address: ""
    })

    useEffect(()=>{
        if (currentArea)
            loadOrganizationsForArea(currentArea.id)
    },[currentArea])

    const loadOrganizationsForArea = async (areaId) => {
        try{
            setLoading(true)
            const organizationsData = await mapService.getAllOrganizationsFromArea(areaId)
            setOrganizations(organizationsData)
        } catch (error) {
            console.error("error loading organizations", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDistrictClick = (district) => {
        setCurrentDistrict(district)
    }

    const handleAreaClick = (area) => {
        setCurrentArea(area)
    }

    const handleOpenForm = (isHead) => {
        setOrganization(prev => ({
            ...prev,
            is_head: isHead ? 1 : 0
        }))
        setIsFormOpen(true)
    }

    const handleCloseForm = () => {
        setIsFormOpen(false)
    }

    const saveOrganization = async (areaId) => {
        try{
            const orgData = {
                ...organization,
                district_num: areaId
            }
            await mapService.insertOrganization(orgData)
            setOrganization({
                head_text: "",
                is_head: false,
                director: "",
                phone: "",
                address: ""
            })
            loadOrganizationsForArea(areaId)
            setIsFormOpen(false)
        } catch (error) {
            console.error("error insert organization data: ", error)
        }
    }

    const handleInputChange = (e) => {
        const {name, value} = e.target
        setOrganization(prev => ({
            ...prev,
            [name]: value
        }))
    }

    if (loading) {
        return(
            <div>loading</div>
        )
    }


    return(
        <div className={styles.container}>
            <div className={styles.container_areaChanges}>
                {!currentDistrict && (
                    <div className={styles.areas_container}>
                        {districtsAdminArray.map((district, i) => (
                            <div key={i} onClick={() => handleDistrictClick(district)}>
                                {district.name}
                            </div>
                        ))}
                    </div>
                )}
                {(currentDistrict) && (
                    <div>
                        {districtsAdminArray.find(district => district.name === currentDistrict.name).area.map((area, i) => (
                            <div key={i} onClick={()=>handleAreaClick(area)}>
                                {area.name}
                            </div>
                        ))}
                    </div>
                )}
                {currentArea && (
                    <div>
                        <button onClick={() => handleOpenForm(false)}>
                            Добавить организацию
                        </button>
                        <button onClick={() => handleOpenForm(true)}>
                            Добавить главную организацию
                        </button>
                    </div>
                )}
            </div>

            {(!currentArea || !currentDistrict) ? (
                <div>"выбери район"</div>
            ) : (
                <div className={styles.container_organizations}>
                    {organizations.map((org, i) => (
                        <div key={i} className={styles.organization_card}>
                            <div className={styles.organization_card_header}>
                                {org.is_head ? ("Главная" + org.head_text) : ("ПО номер " + org.head_text)}
                            </div>
                            <div>
                                {org.address}
                            </div>
                            <div>
                                {org.director}
                            </div>
                            <div>
                                {org.phone}
                            </div>
                        </div>
                    ))}
                </div> 
            )}

            {isFormOpen && (
                <div className={styles.form_fon}>
                    <div className={styles.form}>
                        {organization.is_head ? (
                            <input className={styles.form_input} type="number" name="head_text" value={organization.head_text} onChange={handleInputChange} placeholder="1"/>
                        ) : (
                            <input className={styles.form_input} type="text" name="head_text" value={organization.head_text} onChange={handleInputChange} placeholder="дегунино"/>
                        )} 
                        <input className={styles.form_input} type="text" name="address" value={organization.address} onChange={handleInputChange} placeholder="ул. д."/>
                        <input className={styles.form_input} type="text" name="director" value={organization.director} onChange={handleInputChange} placeholder="ФИО"/>
                        <input className={styles.form_input} type="tel" name="phone" value={organization.phone} onChange={handleInputChange} placeholder="8 ххх ххх хх хх"/>
                        <div>
                            <button onClick={() => saveOrganization(currentArea.id)}>
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminMapWindow;