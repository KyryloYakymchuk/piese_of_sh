import React, { useContext, Fragment } from "react";
import { Route, Switch, Redirect, useParams, NavLink } from "react-router-dom";
import { Nav } from "react-bootstrap";
import * as Roles from "../../../../modules/Roles";
import { ScopeDataContextType, Rights, Options, QsContextType } from "../../../../models/Common";
import ScopeDataContext from "../../context/ScopeDataContext";
import CampaignsTab from "./campaigns/CampaignsTab";
import CampaignGroupsTab from "./campaigngroups/CampaignGroupsTab";
import AdvertisersTab from "./advertisers/AdvertisersTab";
import AgenciesTab from "./agencies/AgenciesTab";
import StatisticsDateRangePicker from "../../shared/StatisticsDateRangePicker";
import { AppUser } from "../../../../models/AppUser";
import UserContext from "../../context/UserContext";
import { Organization } from "../../../../models/data/Organization";
import QsContext from "../../context/QsContext";

const getRedirectUrl = (rights: Rights): string => {
  if (rights.VIEW_CAMPAIGN) {
    return "campaigns";
  }
  if (rights.VIEW_CAMPAIGNGROUP) {
    return "campaigngroups";
  }
  if (rights.VIEW_ADVERTISER) {
    return "advertisers";
  }
  if (rights.VIEW_AGENCY) {
    return "agencies";
  }
  return null;
}

const SettingsOrganization = (props: { videoMode: boolean }) => {
  let { page, scope, scopeId }: any = useParams();
  let { data, loadError } = useContext<ScopeDataContextType>(ScopeDataContext);
  const url = `/${page}/${scope}/${scopeId}`;
  const path = "/:page/:scope/:scopeId";
  const rights: Rights = Roles.getRights(data.rights);
  const redirectUrl = getRedirectUrl(rights);
  const user: AppUser = useContext<AppUser>(UserContext);
  let { daterange } = useContext<QsContextType>(QsContext);
  const startDate: string = daterange.startDate.format("YYYY-MM-DD");
  const endDate: string = daterange.endDate.format("YYYY-MM-DD");
  const search: string = `?sd=${startDate}&ed=${endDate}`;

  const options: Options = {
    startDate,
    endDate,
    scope: "metaAgency",
    scopeId: parseInt(scopeId, 10),
    statistics: rights.VIEW_STATISTICS,
    videoMetrics: props.videoMode
  };

  const tabOptions = { rights, user, scope, scopeId, options, videoMode: props.videoMode };

  if ((data as Organization).organization || loadError.error) {
    return <Fragment>
      <div className="row page-tabs">
        <Nav as="ul" variant="tabs" defaultActiveKey="/campaigns">
          {rights.VIEW_CAMPAIGN && <Nav.Item as="li">
            <NavLink activeClassName="active" className="nav-link" to={`${url}/campaigns${search}`}>Campaigns</NavLink>
          </Nav.Item>}
          {rights.VIEW_CAMPAIGNGROUP && <Nav.Item as="li">
            <NavLink activeClassName="active" className="nav-link" to={`${url}/campaigngroups${search}`}>Campaign groups</NavLink>
          </Nav.Item>}
          {rights.VIEW_ADVERTISER && <Nav.Item as="li">
            <NavLink activeClassName="active" className="nav-link" to={`${url}/advertisers${search}`}>Advertisers</NavLink>
          </Nav.Item>}
          {rights.VIEW_AGENCY && <Nav.Item as="li">
            <NavLink activeClassName="active" className="nav-link" to={`${url}/agencies${search}`}>Agencies</NavLink>
          </Nav.Item>}
        </Nav>
        <div style={{ marginRight: "25px" }}>
          <StatisticsDateRangePicker />
        </div>
      </div>
      <div className="row">
        <Switch>
          {redirectUrl && <Redirect exact from={`${path}`} to={`${path}/${redirectUrl}${search}`} />}
          {rights.VIEW_CAMPAIGN && <Route path={`${path}/campaigns`}><CampaignsTab {...tabOptions} /></Route>}
          {rights.VIEW_CAMPAIGNGROUP && <Route path={`${path}/campaigngroups`}><CampaignGroupsTab {...tabOptions} /></Route>}
          {rights.VIEW_ADVERTISER && <Route path={`${path}/advertisers`}><AdvertisersTab {...tabOptions} /></Route>}
          {rights.VIEW_AGENCY && <Route path={`${path}/agencies`}><AgenciesTab {...tabOptions} /></Route>}
        </Switch>
      </div>
    </Fragment>;
  }
  return null;
}
export default SettingsOrganization;