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
import { UserIcon, MicIcon } from '../../../ui/icons';
import { LabeledCheckbox, LinkButton } from '../../../ui/ui';
import API from '../../../../services/api';
  
  interface PropsFromState {
    user: User.State;
    api: API;
  }
  
  interface Props extends LocalizationProps, PropsFromState {}

  type State = {
    profileSelected: boolean,
    recordingsSelected: boolean,
    recordingSize: number
  }
  
  class DownloadProfile extends React.Component<Props, State> {

    profileSelected: boolean = true;
    recordingsSelected:boolean = true;

    constructor(props: Props, context: any) {
        super(props, context);

        this.state = {
            profileSelected: true,
            recordingsSelected: true,
            recordingSize: 0
        };
    }

    handleInputChange = ({ target }: any) => {
        this.setState({
          [target.name]: target.type === 'checkbox' ? target.checked : target.value,
        } as any);
      };

    async componentDidMount() {
        const sizeResponse = await this.props.api.fetchTotalRecordingSize();

        this.setState({
            recordingSize: sizeResponse.size
        });
    }

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
        const nearBlack = '#4a4a4a';
        const {
            profileSelected,
            recordingsSelected,
            recordingSize
        } = this.state;

        const { getString } = this.props;

        const kibibyte = 1024;
        const mebibyte = kibibyte * kibibyte;
        const gibibyte = mebibyte * kibibyte;
        const bytes = recordingSize;
        let size = '';

        if (bytes < kibibyte) {
            size = `< 1 ${getString('size-kilobyte')}`;
        } else if (bytes < mebibyte) {
            const kb = Math.floor(bytes / kibibyte);
            size = `${kb} ${getString('size-kilobyte')}`;
        } else if (bytes < gibibyte) {
            const mb = Math.floor(bytes / mebibyte);
            size = `${mb} ${getString('size-megabyte')}`;
        } else {
            const gb = Math.floor(bytes / gibibyte);
            size = `${gb} ${getString('size-gigabyte')}`;
        }

        // const megabytes = 4;
        // size =
        // megabytes < 1
        //   ? Math.floor(megabytes * 100) / 100 + ' ' + getString('size-megabyte')
        //   : megabytes > 1024
        //   ? Math.floor(megabytes / 1024) + ' ' + getString('size-gigabyte')
        //   : Math.floor(megabytes) + ' ' + getString('size-megabyte');
  
  
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
                        </div>
                        <div>
                            <Localized id="profile">
                                <p/>
                            </Localized>
                        
                            <Localized id="download-profile-description">
                                <small>
                                    <p/>
                                </small>
                            </Localized>
                        </div>
                        <div>
                            <div className="bordered-cell">
                                <Localized id="size" $size={size}>
                                    <span className="size"/>
                                </Localized>
                                <br/>
                                <span className="size-value">
                                    {size}
                                </span>
                            </div>
                        </div>                        
                        <div>
                        <LabeledCheckbox
                            label={
                            <Localized id="selected">
                                <b>
                                    <span />
                                </b>
                            </Localized>
                            }
                            name="profileSelected"
                            checked={profileSelected}
                            onChange={this.handleInputChange}
                            style={{ marginBottom: 40 }}
                        />
                        </div>
                    </div>
                    <div className="download-recordings">
                        <div>
                            <MicIcon color={ nearBlack } />
                        </div>
                        <div>
                            <Localized id="recordings">
                                <p/>
                            </Localized>
                        
                            <Localized id="download-recordings-description">
                                <small>
                                    <p/>
                                </small>
                            </Localized>
                        </div>
                        <div>
                            <div className="bordered-cell">
                                <Localized id="size" $size={size}>
                                    <span className="size"/>
                                </Localized>
                                <br/>
                                <span className="size-value">
                                    {size}
                                </span>
                            </div>
                        </div>                        
                        <div>
                        <LabeledCheckbox
                            label={
                            <Localized id="selected">
                                <b>
                                    <span />
                                </b>
                            </Localized>
                            }
                            name="recordingsSelected"
                            checked={recordingsSelected}
                            onChange={this.handleInputChange}
                            style={{ marginBottom: 40 }}
                        />
                        </div>
                    </div>
                </div>
                <hr className="hr"/>
                <div className="start-download">
                    <LinkButton
                        href={ '#' }
                    //   onClick={this.saveHasDownloaded}
                        rounded
                    >
                        <Localized
                            id="start-download"
                            $size={ size.toLocaleLowerCase() }>
                            <span />
                        </Localized>
                    </LinkButton>
                </div>                
          </div>
      );
    }
  }
  
  export default connect<PropsFromState>(({ user, api }: StateTree) => ({ user, api }))(
    withLocalization(DownloadProfile)
  );
  