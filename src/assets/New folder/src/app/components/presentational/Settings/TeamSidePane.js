import React, { useEffect, useState, useRef } from "react";
import { getTeamReps } from "@apis/topbar";
import config from "@constants/Settings";
import commonConfig from "@constants/common";
import { Label, Icon, Success, Error, DropdownSelect } from "@reusables";
import { Spinner } from "@presentational/reusables/index";
import { uid } from "@tools/helpers";

const TeamsSidePane = (props) => {
    const sidePaneRef = useRef(null);

    const [reps, setreps] = useState([]);
    const [teamManagers, setteamManagers] = useState([]);
    const [successMessage, setsuccessMessage] = useState("");
    const [errorMessage, seterrorMessage] = useState("");
    const [isLoading, setisLoading] = useState(true);

    const getReps = () => {
        getTeamReps(props.domain, props.activeTeam.id)
            .then((res) => {
                setisLoading(true);
                setsuccessMessage(config.TEAM_MANAGER.successMessage);
                return res;
            })
            .then((res) => {
                setreps(res);
                setisLoading(false);
            })
            .catch((err) => {
                seterrorMessage(err.toString());
            });

        setTimeout(() => {
            setsuccessMessage("");
            seterrorMessage("");
        }, 2000);
    };

    useEffect(() => {
        // Get the managers out of the reps of the current team.
        let newManagers = [];
        if (Array.isArray(reps.results))
            newManagers = reps.results.filter(
                (rep) => rep.designation === commonConfig.MANAGER
            );
        setteamManagers(newManagers);
    }, [reps]);

    const changeRole = (repId, roleId) => {
        if (repId && roleId) {
            if (roleId == commonConfig.MANAGER && teamManagers.length > 0) {
                seterrorMessage(
                    config.TEAM_MANAGER.teamManagerExists +
                        ` ${teamManagers[0].first_name}`
                );
                setTimeout(() => seterrorMessage(""), 2000);
            } else props.changeRole(repId, roleId, getReps);
        }
    };

    // const getReps = pageOffset => {
    // 	if (pageOffset && pageOffset >= 0) {
    // 		let teamId = props.activeTeam.id ? props.activeTeam.id : 0;
    // 		getPageReps(domain, teamId, offset).then(res => {
    // 			setreps(res);
    // 			sethasPrevPage(res.previous ? true : false);
    // 			sethasNextPage(res.next ? true : false);
    // 		});
    // 	}
    // };

    // const changePage = (next = true) => {
    // 	if (!next && hasPrevPage) {
    // 		// Previous Page
    // 		setoffset(pageOffset => {
    // 			getReps(pageOffset - 1);
    // 		});
    // 	} else if (hasNextPage) {
    // 		setoffset(offset + 1);
    // 	}
    // };

    useEffect(() => {
        const checkToClose = (event) => {
            if (
                sidePaneRef.current &&
                !sidePaneRef.current.contains(event.target)
            ) {
                props.toggleSidePane();
            }
        };
        // document.addEventListener('click', checkToClose);
        getReps();
        return () => {
            // document.removeEventListener('click', checkToClose);
        };
    }, [props.activeTeam.id]);

    return (
        <div className={"teamsidepane-container"}>
            <div className={"teamsidepane"} ref={sidePaneRef}>
                <div className={"teamsidepane-top"}>
                    <div className={"teamsidepane-top-heading"}>
                        TEAM : {props.activeTeam.name}
                    </div>
                    <div className={"teamsidepane-top-right"}>
                        <Icon
                            className={"closeicon fa-times"}
                            handleClick={() => props.toggleSidePane()}
                        />
                    </div>
                </div>
                <div className={"teamsidepane-mainsettings"}>
                    {/* Doesn't matter if there are more than one managers present for the team, show only one of them (The first one in the array).*/}
                    <div className={"inputsection"}>
                        <Label label={config.TEAM_MANAGER.leaderLabel} /> :{" "}
                        <span
                            className={`teammanager ${
                                !teamManagers[0] ? "nomanager" : ""
                            }`}
                        >
                            {teamManagers[0]
                                ? teamManagers[0].first_name +
                                  teamManagers[0].middle_name +
                                  teamManagers[0].last_name
                                : config.TEAM_MANAGER.selectLeader}
                        </span>
                    </div>
                </div>
                <div className={"teamsidepane-teammembers"}>
                    {isLoading ? (
                        <div className="loader-container">
                            <Spinner loading />
                        </div>
                    ) : (
                        <div className={"repstable"}>
                            <div className={"repstable-heading"}>
                                <div
                                    className={
                                        "repstable-heading-field fullname"
                                    }
                                >
                                    <Label
                                        label={
                                            config.TEAM_MANAGER.fullNameLabel
                                        }
                                    />
                                </div>
                                <div
                                    className={"repstable-heading-field email"}
                                >
                                    <Label
                                        label={
                                            config.TEAM_MANAGER
                                                .emailAddressLabel
                                        }
                                    />
                                </div>
                                <div className={"repstable-heading-field role"}>
                                    <Label
                                        label={config.TEAM_MANAGER.roleLabel}
                                    />
                                </div>
                            </div>
                            {reps.results
                                ? reps.results.map((rep, index) =>
                                      rep.id !== props.user.id ? (
                                          <div
                                              className={"repstable-row"}
                                              key={uid() + index}
                                          >
                                              <div
                                                  className={
                                                      "repstable-row-field fullname"
                                                  }
                                              >
                                                  {rep.first_name +
                                                      " " +
                                                      rep.middle_name +
                                                      " " +
                                                      rep.last_name}
                                              </div>
                                              <div
                                                  className={
                                                      "repstable-row-field email"
                                                  }
                                              >
                                                  {rep.email}
                                              </div>
                                              <div
                                                  className={
                                                      "repstable-row-field role"
                                                  }
                                              >
                                                  <DropdownSelect
                                                      withIds={true}
                                                      field={"name"}
                                                      options={props.roles}
                                                      selectedIndex={
                                                          rep.designation
                                                      }
                                                      selectName={"userrole"}
                                                      selectClass={"roleselect"}
                                                      selectValue={
                                                          rep.designation
                                                      }
                                                      handleChange={(event) => {
                                                          changeRole(
                                                              rep.id,
                                                              event.target.value
                                                          );
                                                      }}
                                                  />
                                              </div>
                                          </div>
                                      ) : (
                                          ""
                                      )
                                  )
                                : ""}
                        </div>
                    )}
                </div>
                <div className={"teamsidepane-bottom"}>
                    {errorMessage ? (
                        <Error errorMessage={errorMessage} />
                    ) : successMessage ? (
                        <Success successMessage={successMessage} />
                    ) : (
                        <Icon className={"fa-check-circle greenicon"} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamsSidePane;
