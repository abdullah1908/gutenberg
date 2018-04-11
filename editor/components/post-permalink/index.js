/**
 * External dependencies
 */
import { connect } from 'react-redux';

/**
 * WordPress dependencies
 */
import { Component } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { Dashicon, Button, ClipboardButton, Tooltip } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import './style.scss';
import PostPermalinkEditor from './editor.js';
import { isEditedPostNew, isPermalinkEditable, getEditedPostPreviewLink, getSamplePermalink } from '../../store/selectors';
import { getWPAdminURL } from '../../utils/url';

class PostPermalink extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			iconClass: '',
			editingPermalink: false,
		};
	}

	componentDidUpdate( prevProps, prevState ) {
		// If we've just stopped editing the permalink, focus on the new permalink.
		if ( prevState.editingPermalink && ! this.state.editingPermalink ) {
			this.permalinkButton.focus();
		}
	}

	render() {
		const { isNew, previewLink, isEditable, samplePermalink } = this.props;
		const { iconClass, editingPermalink } = this.state;

		if ( isNew || ! previewLink ) {
			return null;
		}

		return (
			<div className="editor-post-permalink">
				<Tooltip text={ __( 'Copy the permalink to your clipboard' ) }>
					<ClipboardButton
						className="editor-post-permalink__copy"
						text={ samplePermalink }
						onCopy={ () => this.setState( { iconClass: 'is-copied' } ) }
					>
						<Dashicon icon="admin-links" className={ iconClass } />
					</ClipboardButton>
				</Tooltip>

				<span className="editor-post-permalink__label">{ __( 'Permalink:' ) }</span>

				{ ! editingPermalink &&
					<Button
						className="editor-post-permalink__link"
						href={ previewLink }
						target="_blank"
						ref={ ( permalinkButton ) => this.permalinkButton = permalinkButton }
					>
						{ decodeURI( samplePermalink ) }
						&lrm;
					</Button>
				}

				{ editingPermalink &&
					<PostPermalinkEditor
						onSave={ () => this.setState( { editingPermalink: false } ) }
					/>
				}

				{ isEditable && ! editingPermalink &&
					<Button
						className="editor-post-permalink__edit"
						isLarge
						onClick={ () => this.setState( { editingPermalink: true } ) }
					>
						{ __( 'Edit' ) }
					</Button>
				}

				{ ! isEditable &&
					<Button
						className="editor-post-permalink__change"
						isLarge
						href={ getWPAdminURL( 'options-permalink.php' ) }
						target="_blank"
					>
						{ __( 'Change Permalinks' ) }
					</Button>
				}
			</div>
		);
	}
}

export default connect(
	( state ) => {
		return {
			isNew: isEditedPostNew( state ),
			previewLink: getEditedPostPreviewLink( state ),
			isEditable: isPermalinkEditable( state ),
			samplePermalink: getSamplePermalink( state ),
		};
	}
)( PostPermalink );

