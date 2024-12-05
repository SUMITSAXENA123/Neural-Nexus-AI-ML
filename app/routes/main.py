from flask import Blueprint, render_template, jsonify, request

main = Blueprint('main', __name__)

# Home route rendering the main dashboard
@main.route('/')
def index():
    return render_template(
        'index.html',
        total_transactions=525461,
        total_fraud=26228,
        fraud_rate=4.99
    )

# Route for analysis report with query parameters
@main.route('/analysis-report', methods=['GET'])
def analysis_report():
    try:
        # Get query parameters from request
        country = request.args.get('country', 'Global')  # Default to 'Global'
        date_range = request.args.get('date_range', 'Last 30 Days')  # Default date range
        
        return render_template(
            'analysis_report.html',
            selected_country=country,
            selected_date_range=date_range
        )
    except Exception as e:
        # Handle exceptions gracefully
        print(f"Error in analysis report: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Export the Blueprint instance
__all__ = ['main']
