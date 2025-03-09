(() => {
    const React = window.React;
    
    function ProgressBarComponent(props) {
        const {
            style,
            className,
            startStep,
            endStep,
            currentStep,
            bgColor,
            progressColor,
            borderRadius,
            animationDuration,
            showStepLines,
            stepLineColor
        } = props;
    
        const totalSteps = endStep - startStep;
        const currentPosition = Math.max(0, Math.min(currentStep - startStep, totalSteps));
        const progressPercentage = (totalSteps > 0) ? (currentPosition / totalSteps * 100) : 0;
        const formattedPercentage = Math.round(progressPercentage * 100) / 100;
    
        const [animatedWidth, setAnimatedWidth] = React.useState(`${formattedPercentage}%`);
    
        React.useEffect(() => {
            setAnimatedWidth(`${formattedPercentage}%`);
        }, [formattedPercentage, animationDuration]);
    
        const containerStyle = {
            position: 'relative',
            overflow: 'hidden',
            width: '100%',
            height: '100%',
            backgroundColor: bgColor,
            borderRadius: `${borderRadius}px`,
            ...style
        };
    
        const progressStyle = {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: animatedWidth,
            backgroundColor: progressColor,
            borderRadius: `${borderRadius}px 0 0 ${borderRadius}px`,
            transition: `width ${animationDuration}s ease-in-out`
        };
    
        return React.createElement(
            'div',
            { style: containerStyle, className: className },
            React.createElement('div', { style: progressStyle }),
            showStepLines && totalSteps > 1 && Array.from({ length: totalSteps - 1 }).map((_, i) => {
                return React.createElement('div', {
                    key: i,
                    style: {
                        position: 'absolute',
                        left: `${((i + 1) / totalSteps) * 100}%`,
                        top: 0,
                        height: '100%',
                        width: '2px',
                        backgroundColor: stepLineColor,
                        transform: 'translateX(-50%)'
                    }
                });
            })
        );
    }


    const ProgressBarNode = {
        name: 'noodl.controls.progressbar',
        displayName: 'Progress Bar',
        category: 'Visual',
        color: 'component',
        
        initialize: function() {
            this.props = {
                startStep: 0,
                endStep: 100,
                currentStep: 0,
                bgColor: '#E0E0E0',
                progressColor: '#4CAF50',
                borderRadius: 4,
                animationDuration: 0.5,
                showStepLines: false,
                stepLineColor: '#000000'
            };
            
            this.outputs = {
                progress: 0,
                completed: false
            };
            
            this.lastProgress = 0;
        },
        
        inputs: {
            startStep: { type: 'number', displayName: 'Start Step', group: 'Steps', default: 0 },
            endStep: { type: 'number', displayName: 'End Step', group: 'Steps', default: 100 },
            currentStep: { type: 'number', displayName: 'Current Step', group: 'Steps', default: 0 },
            bgColor: { type: 'color', displayName: 'Background Color', group: 'Style', default: '#E0E0E0' },
            progressColor: { type: 'color', displayName: 'Progress Color', group: 'Style', default: '#4CAF50' },
            borderRadius: { type: 'number', displayName: 'Border Radius', group: 'Style', default: 4 },
            animationDuration: { type: 'number', displayName: 'Animation Duration (s)', group: 'Animation', default: 0.5 },
            showStepLines: { type: 'boolean', displayName: 'Show Step Lines', group: 'Style', default: false },
            stepLineColor: { type: 'color', displayName: 'Step Line Color', group: 'Style', default: '#000000' },
            reset: { type: 'signal', displayName: 'Reset', group: 'Control' }
        },
        
        outputs: {
            progress: { type: 'number', displayName: 'Progress (%)', group: 'Output' },
            completed: { type: 'signal', displayName: 'Completed', group: 'Output' }
        },
        
        methods: {
            calculateProgress: function() {
                const totalSteps = this.props.endStep - this.props.startStep;
                const currentPosition = Math.max(0, Math.min(this.props.currentStep - this.props.startStep, totalSteps));
                return (totalSteps > 0) ? (currentPosition / totalSteps * 100) : 0;
            },
            
            updateOutputs: function() {
                const progress = this.calculateProgress();
                const formattedProgress = Math.round(progress * 100) / 100;
                
                this.flagOutputDirty('progress');
                this.outputs.progress = formattedProgress;
                this.setOutputs({ progress: formattedProgress });
                
                if (formattedProgress >= 100 && this.lastProgress < 100) {
                    this.sendSignalOnOutput('completed');
                }
                
                this.lastProgress = formattedProgress;
            }
        },
        
        changed: {
            startStep: function(value) {
                this.props.startStep = value;
                this.updateOutputs();
                this.forceUpdate();
            },
            endStep: function(value) {
                this.props.endStep = value;
                this.updateOutputs();
                this.forceUpdate();
            },
            currentStep: function(value) {
                this.props.currentStep = value;
                this.updateOutputs();
                this.forceUpdate();
            },
            bgColor: function(value) {
                this.props.bgColor = value;
                this.forceUpdate();
            },
            progressColor: function(value) {
                this.props.progressColor = value;
                this.forceUpdate();
            },
            stepLineColor: function(value) {
                this.props.stepLineColor = value;
                this.forceUpdate();
            },
            showStepLines: function(value) {
                this.props.showStepLines = value;
                this.forceUpdate();
            },
            reset: function() {
                this.props.currentStep = this.props.startStep;
                this.updateOutputs();
                this.forceUpdate();
            },
            animationDuration: function(value) {
                this.props.animationDuration = value;
                this.forceUpdate();
            }
        },
        
        getReactComponent: function() {
            return ProgressBarComponent;
        }
    };
    
    const nodeDefinition = Noodl.defineReactNode(ProgressBarNode);
    
    Noodl.defineModule({
        reactNodes: [nodeDefinition],
        setup() {}
    });
})();