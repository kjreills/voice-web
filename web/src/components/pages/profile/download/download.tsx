import {
    LocalizationProps,
    Localized,
    withLocalization,
  } from 'fluent-react/compat';
import * as React from 'react';
import { connect } from 'react-redux';
import { User } from '../../../../stores/user';
import StateTree from '../../../../stores/tree';
import { UserClient } from 'common/user-clients';
import './download.css';
import { UserIcon } from '../../../ui/icons';
  
  interface PropsFromState {
    user: User.State;
  }
  
  interface Props extends LocalizationProps, PropsFromState {}
  
  class DownloadProfile extends React.Component<Props> {

    // may need to re-write
    downloadData(account: UserClient) {
        // const text = [
        //   ...Object.entries(pick(account, 'email', 'username', 'age', 'gender')),
        //   ...account.locales.reduce((all, l, i) => {
        //     const localeLabel = 'language ' + (i + 1);
        //     return [
        //       ...all,
        //       [localeLabel, l.locale],
        //       [localeLabel + ' accent', l.accent],
        //     ];
        //   }, []),
        // ]
        //   .map(([key, value]) => key + ': ' + value)
        //   .join('\n');
      
        // const element = document.createElement('a');
        // element.setAttribute(
        //   'href',
        //   'data:text/plain;charset=utf-8,' + encodeURIComponent(text)
        // );
        // element.setAttribute('download', 'profile.txt');
      
        // element.style.display = 'none';
        // document.body.appendChild(element);
      
        // element.click();
      
        // document.body.removeChild(element);
    }
    
    render() {
      return (
          <div className="profile-download">
                <div>
                    <h2>
                        <Localized id="download-header">
                            <span />
                        </Localized>
                    </h2>

                    <p>
                        <Localized id="download-subheader">
                            <span />
                        </Localized>
                    </p>
                </div>
                <hr className="hr"/>
                <div className="download-options">
                    <div className="download-profile-info">
                        <div>
                            <UserIcon/>
                                <Localized id="profile">
                                    <p/>
                                </Localized>
                            
                                <Localized id="download-profile-description">
                                    <p/>
                                </Localized>
                        </div>
                        

                    </div>
                    <div className="download-recordings">

                    </div>
                </div>
          </div>
      );
    }
  }
  
  export default connect<PropsFromState>(({ user }: StateTree) => ({ user }))(
    withLocalization(DownloadProfile)
  );
  