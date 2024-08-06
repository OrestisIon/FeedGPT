
// react-router components
import { Link } from "react-router-dom";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import MuiLink from "@mui/material/Link";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import parse from 'html-react-parser';
import MDBadge from "components/MDBadge";
import StarOutlineIcon from '@mui/icons-material/StarOutline';
import StarIcon from '@mui/icons-material/Star';
import { useEffect, useState } from "react";

function SimpleBlogCard({ title, description, action, readtime, starred, status, onStarClick,onRead, entryId }) {
  const [thisStar, setThisStar] = useState(false);
  const [read, setRead] = useState('unread');

    const handleClick = (event) => {
      event.preventDefault(); // Prevent the link from navigating
      if (read === 'unread') {
        event.preventDefault(); // Prevent going to the link immediately
        setRead('read');
        onRead(entryId);
        // Optionally, open the link in a new tab after the state is updated
        // This is only necessary if you need to delay the link navigation
        // until after some other logic has executed
        window.open(action.route, '_blank', 'noopener,noreferrer');
      }
    };
  
  useEffect(() => {
    setThisStar(starred);
  }, [entryId, starred]); 

  useEffect(() => {
    setRead(status);
  }, [entryId, status]); 
  return (
    <Card>
      <MDBox p={3}>
        <MDBox display="flex" alignItems="center" justifyContent="normal" width="100%">
          <MDTypography display="inline" variant="subtitle1" textTransform="capitalize" fontWeight="bold" flexShrink={1} style={{ marginRight: 'auto' }}>
            {title}
          </MDTypography>
          <MDBox display="flex" justifyContent="flex-end" alignItems="center" flexShrink={0}>
            {status === "read" ? (
              <MDBadge
                badgeContent="Read"
                variant="contained"
                color="success"
                style={{ marginRight: '12px', width: 'auto', height: '36px' }} // Add marginRight for spacing and width, height for size
              />
            ) : (
                <MDBadge
                  badgeContent="Unread"
                  // circular={true}
                  variant="gradient"
                  container={true}
                  color="error"
                  style={{ marginRight: '12px',width: 'auto', height: '36px' }} // Ensure same size as the first badge
                />
            )}
            <MDButton
              variant="outlined"
              iconOnly={true}
              onClick={(e) => {
                e.preventDefault(); // Corrected to call the function
                const newStarValue = !thisStar;
                setThisStar(newStarValue); // Update state
                onStarClick(entryId, newStarValue); // Pass the new state to the handler
              }}
              style={{ minWidth: '36px', height: '36px' }} // Adjust to ensure button has the same height as badges
            >
              {thisStar ? <StarIcon style={{ color: 'yellow' }} /> : <StarOutlineIcon />}
            </MDButton>
          </MDBox>
        </MDBox>
        <MDBox mt={2} mb={3}>
          {readtime && <MDBadge badgeContent={"Reading Time: " + readtime} variant="gradient" container color="secondary" />}
          <MDTypography variant="body2" component="p" color="text">
            {parse(description)}
          </MDTypography>
        </MDBox>
        {action.type === "external" ? (
          <MuiLink href={action.route} target="_blank" rel="noreferrer">
            <MDButton onClick={handleClick} color={action.color ? action.color : "dark"}>
              {action.label}
            </MDButton>
          </MuiLink>
        ) : (
          <Link to={action.route}>
            <MDButton color={action.color ? action.color : "dark"}>{action.label}</MDButton>
          </Link>
        )}
      </MDBox>
    </Card>
  );
}

// Typechecking props for the SimpleBlogCard
SimpleBlogCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  readtime: PropTypes.number, // Optional
  starred: PropTypes.bool.isRequired,
  status: PropTypes.oneOf(["read", "unread"]).isRequired,
  onStarClick: PropTypes.func.isRequired,
  onRead: PropTypes.func.isRequired,
  entryId: PropTypes.number.isRequired,
  action: PropTypes.shape({
    type: PropTypes.oneOf(["external", "internal"]).isRequired,
    route: PropTypes.string.isRequired,
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "light",
      "default",
    ]),
    label: PropTypes.string.isRequired,
  }).isRequired,
};

export default SimpleBlogCard;
