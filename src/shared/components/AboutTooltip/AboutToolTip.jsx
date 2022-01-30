// Local
import Button from '../Button/Button';
import Tooltip from '../Tooltip/Tooltip';
import { FeedbackDropdown, FeedbackImageCont, FeedbackImage, FeedbackParagraph } from './AboutTooltip.scripts';

import './AboutToolTip.css'

const AboutTooltip = tooltipProps => (
  <Tooltip
    width={300}
    {...tooltipProps}
    renderContent={() => (
      <FeedbackDropdown>

        <FeedbackParagraph>
          This is a native macOS application that allows developers to track work between Jira and Github 🎉
        </FeedbackParagraph>

        <FeedbackParagraph>
          {'Read more on my website or reach out via '}
          <a href="mailto:sidpremkumar@gmail.com">
            <strong>sidpremkumar@gmail.com</strong>
          </a>
        </FeedbackParagraph>

        <div className='tooltip_btn'>
          <a href="https://sidpremkumar.com/" target="_blank" rel="noreferrer noopener" style={{ 'text-decoration': 'none'}}>
            <Button style={{ 'border-style': 'none', 'margin-right': 5 }} variant="primary">Visit Website</Button>
          </a>

          <a href="https://github.com/sidpremkumar/gira" target="_blank" rel="noreferrer noopener" style={{ 'text-decoration': 'none'}}>
            <Button style={{ 'border-style': 'none' }} icon="github">
              Github Repo
            </Button>
          </a>
        </div>
        
      </FeedbackDropdown>
    )}
  />
);

export default AboutTooltip;