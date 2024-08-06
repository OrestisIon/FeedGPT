import React from 'react';
import { List, ListItem, ListItemText, Collapse } from '@mui/material';
import { NavLink } from 'react-router-dom';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { ListItemButton } from '@mui/material';
import MDTypography from "components/MDTypography";
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";


const Categories = ({ categories }, { textColor }) => {
    const [open, setOpen] = React.useState({});
    const collapseName = location.pathname.replace("/", "");

    const handleClick = (category) => {
        setOpen({ ...open, [category]: !open[category] });
    };
    textColor = "white";

    return (
        <List>
            {categories.map((category, index) => (
                <React.Fragment key={index}>
                    <ListItem onClick={() => handleClick(category.title)} sx={{ paddingTop: '10px', paddingBottom: '10px' }}>
                        <MDTypography
                            color={textColor}
                            display="block"
                            variant="caption"
                            fontWeight="bold"
                            textTransform="uppercase"
                            pl={3}
                            mt={2}
                            mb={1}
                            ml={1}
                        >
                            {category.title}
                        </MDTypography>
                        {open[category.title] ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                    <Collapse in={open[category.title]} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {category.links.map((link, linkIndex) => (
                                <NavLink key={link.key} to={link.route}>
                                    <SidenavCollapse
                                        key={linkIndex}
                                        name={link.name}
                                        active={link.key === collapseName}
                                    />
                                </NavLink>
                            ))}
                        </List>
                    </Collapse>
                </React.Fragment>
            ))}
        </List>
    );
};


Categories.propTypes = {
    categories: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            links: PropTypes.arrayOf(
                PropTypes.shape({
                    route: PropTypes.string.isRequired,
                    name: PropTypes.string.isRequired,
                })
            ).isRequired,
        })
    ).isRequired,
};


export default Categories;