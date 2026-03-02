import json

nb_path = r'c:\Users\M I C R O S P A C E\Desktop\My Projects\AI-Programme-Vibe-Coding\Week_2\2Weeks_Tanzania_Traffic_Classification_YOLOv5_Hub.ipynb'

with open(nb_path, 'r', encoding='utf-8') as f:
    nb = json.load(f)

answers = {
    # Q1 - Training Data Distribution Mismatch
    'Y-vtyms6aC4g': (
        "**\U0001f511 PM's Answer:**\n"
        "\n"
        "The root cause of this misclassification is a phenomenon known as **Training Data Distribution Mismatch**, commonly referred to as **Domain Gap**.\n"
        "\n"
        "The pre-trained YOLOv5 model was trained on the **COCO dataset** \u2014 a collection of images predominantly sourced from Western cities (North America and Europe). COCO contains **80 object classes** but **zero examples** of uniquely East African vehicle types such as the **Bajaj (tricycle-taxi)** or the **Bodaboda (motorcycle-taxi)** operating in a Tanzanian traffic context.\n"
        "\n"
        "When the model encounters a Tanzanian Bajaj, its internal convolutional layers search for the closest statistical match in its learned vocabulary. The three-wheeled body shape most closely resembles a 'car' in bounding-box dimensions, and the engine/chassis structure fits loosely within the 'truck' or 'motorcycle' feature space. Since no Bajaj class exists in its knowledge base, it **maps an unfamiliar object to the nearest familiar category** \u2014 a classic symptom of out-of-distribution (OOD) inference.\n"
        "\n"
        "**PM's Conclusion:** This is not a failure of the AI's mathematics \u2014 it is a failure of the *data pipeline*. You cannot teach a model what it has never seen. This is precisely why **local, Tanzanian-specific training data** is not optional \u2014 it is the single most critical asset in building a culturally-aware, reliable AI for our streets.\n"
        "\n"
        "---\n"
    ),

    # Q2 - Background Interference
    'hAeuoYeAaEau': (
        "**\U0001f511 PM's Answer:**\n"
        "\n"
        "Background differences act as a critical **interference (noise) factor** during object detection in three key ways:\n"
        "\n"
        "**1. Feature Confusion \u2014 False Negatives:** YOLOv5's layers extract visual features such as edges, textures, and contrast patterns to locate objects. A model trained on Seoul's clean asphalt learns that a 'road' has smooth, high-contrast texture with sharp lane markings. Tanzanian dusty, unpaved laterite roads present an entirely different texture distribution. The model's background detector becomes confused, causing it to *miss real objects* or produce inaccurate bounding boxes.\n"
        "\n"
        "**2. Lighting and Color Bias:** Korean and Western training data features specific weather conditions \u2014 overcast skies and artificial street lighting. Tanzanian roads, especially in Dar es Salaam and Arusha, experience intense tropical sunlight, creating harsh shadows and glare. The model is statistically unprepared for these lighting patterns, causing vehicle colors and surface reflections to appear as 'unknown patterns' and degrading confidence scores.\n"
        "\n"
        "**3. Scene Context Mismatch:** Modern detectors use **contextual scene understanding**. A bus near a clean bus stop in Seoul is high-confidence 'bus' territory. A Daladala parked on a dirt road shoulder surrounded by market stalls represents a contextual scenario the model has never encoded \u2014 causing cascading misclassifications.\n"
        "\n"
        "**PM's Conclusion:** This demonstrates that **background diversity is a first-class data requirement**. Our solution \u2014 collecting photos on *actual Tanzanian roads* \u2014 directly addresses this interference at its source, teaching the model what the real background environment looks like.\n"
        "\n"
        "---"
    ),

    # Q3 - Localization
    'VQQsnR8Acmm3': (
        "**\U0001f511 PM's Answer:**\n"
        "\n"
        "If we skipped the **data localization step** and trained on the raw Dhaka dataset, inference output labels would display original Dhaka class names \u2014 specifically **'Rickshaw', 'Motorcycle', 'Bus', 'Misc'** \u2014 rather than Tanzanian equivalents. This creates three levels of critical confusion:\n"
        "\n"
        "**1. Linguistic Confusion:** The word 'Rickshaw' has no meaningful cultural anchor in Tanzania. A local traffic authority official looking at an AI dashboard that labels a three-wheeled taxi as 'Rickshaw' would not immediately know what was detected. 'Rickshaw' carries South Asian \u2014 not East African \u2014 cultural context. In Tanzania, the universally recognized term is 'Bajaj,' used by everyone from traffic police to schoolchildren.\n"
        "\n"
        "**2. Regulatory / Operational Confusion:** Tanzania's traffic laws categorize vehicles by their local registered names. If an AI system deployed by TANROADS logs detections as 'Rickshaw' instead of 'Bajaj,' the data cannot be integrated into existing licensing, ticketing, or enforcement databases without expensive post-processing translation layers \u2014 adding cost and introducing further errors.\n"
        "\n"
        "**3. Trust Erosion:** User trust in an AI system is directly tied to whether it 'speaks the user's language.' An AI that calls a Daladala a generic 'Bus' will feel foreign to Tanzanian operators, undermining confidence in the system's intelligence and hindering adoption. **Localization is not decoration; it is a core usability and adoption requirement.**\n"
        "\n"
        "**PM's Conclusion:** This single YAML edit costs zero additional compute time but contributes enormously to product-market fit, regulatory compliance, and end-user trust \u2014 a textbook example of high-ROI PM decision-making.\n"
        "\n"
        "---"
    ),

    # Q4 - Transfer Learning
    'uytXqAZrdU95': (
        "**\U0001f511 PM's Answer:**\n"
        "\n"
        "**Transfer Learning (`yolov5s.pt`) vs. Training from Random Weights (Scratch):**\n"
        "\n"
        "| Dimension | Pre-trained (`yolov5s.pt`) | Random Weights (Scratch) |\n"
        "|---|---|---|\n"
        "| **Starting Point** | Already knows edges, shapes, textures, and 80 COCO objects | Starts from pure noise \u2014 knows nothing |\n"
        "| **Training Speed** | Convergence within 10\u201320 fine-tuning epochs | May require 100\u2013300+ epochs before meaningful patterns emerge |\n"
        "| **Initial Accuracy** | High baseline accuracy from Day 1 | Near-zero accuracy for many early epochs (random-guessing phase) |\n"
        "| **Data Requirement** | Good results even with small local datasets | Requires tens of thousands of labeled images |\n"
        "| **Risk Level** | Low \u2014 worst case, slight overshoot on fine-tuning | High \u2014 may never converge with a small dataset |\n"
        "\n"
        "**Why Transfer Learning is specifically superior for this project:**\n"
        "\n"
        "Our Tanzanian training dataset is relatively small. Training from scratch on this volume would result in severe **underfitting** \u2014 the model would lack enough examples to learn basic visual primitives (what a wheel looks like, what a road edge looks like) from zero.\n"
        "\n"
        "By using `yolov5s.pt`, we leverage **years of Silicon Valley compute time and millions of training images** as our foundation. We only need to *redirect* the model's existing visual intelligence toward Tanzanian-specific classes \u2014 a task that takes minutes instead of days at zero extra cost.\n"
        "\n"
        "**PM's Analogy:** Hiring an experienced engineer who already knows how to code, then teaching them our company's specific product \u2014 versus hiring someone with no experience and teaching them programming from scratch. Transfer Learning is always the pragmatic PM choice when time and data are constrained.\n"
        "\n"
        "---"
    ),

    # Q5 - QA Results Comparison
    'FQfz40s8jEfd': (
        "**\U0001f511 PM's Answer:**\n"
        "\n"
        "**Comparing 'Before' (Phase 1 \u2014 Global YOLOv5) vs. 'After' (Phase 5 \u2014 Fine-Tuned Tanzania Model):**\n"
        "\n"
        "**Improvement #1 \u2014 Correct Class Identity (The Most Critical Win):**\n"
        "In Phase 1, the global model labeled our Daladala as **'Bus (0.62)'** and completely missed the Bajaj \u2014 zero detections. After 15 epochs of fine-tuning with our localized Tanzanian dataset, the Phase 5 model correctly identifies the same vehicle as **'Daladala (Bus) (0.71)'** and begins classifying three-wheelers as **'Bajaj (Tricycle).'** This is the most direct proof that our localization and fine-tuning strategy succeeded: the model now speaks our language and recognizes our vehicles by their correct identities.\n"
        "\n"
        "**Improvement #2 \u2014 Bounding Box Precision (Spatial Accuracy / IoU):**\n"
        "In Phase 1, bounding boxes tended to be oversized \u2014 often encompassing surrounding background elements such as market stalls or road surfaces, as the model was pattern-matching against Western vehicle silhouettes. After fine-tuning, bounding boxes tighten significantly around the actual vehicle body. This improvement in **IoU (Intersection over Union)** is safety-critical: in an autonomous vehicle context, an imprecise bounding box translates directly to incorrect distance estimation and trajectory planning \u2014 a tangible safety hazard that fine-tuning directly reduces.\n"
        "\n"
        "**PM's Conclusion:** Even with only 15 Rapid Prototyping epochs, the fine-tuned model demonstrates measurable, qualitative, and quantitative improvement over the global baseline \u2014 powerfully validating the entire Data-Centric AI hypothesis of this project.\n"
        "\n"
        "---"
    ),

    # Q6 - Confidence Threshold
    'BkttuLB0jPon': (
        "**\U0001f511 PM's Answer:**\n"
        "\n"
        "**The Threshold Decision Framework for Autonomous Vehicle Safety:**\n"
        "\n"
        "A confidence score of **0.35 (35%)** for a Daladala detection is below any responsible hard-safety-action threshold for production autonomous driving. However, the correct PM decision is **not simply 'ignore it'** \u2014 that would be equally dangerous in dense urban traffic.\n"
        "\n"
        "The professional approach is a **Tiered Response System** based on confidence thresholds:\n"
        "\n"
        "| Confidence Score | System Response | Reasoning |\n"
        "|---|---|---|\n"
        "| **> 0.75 (High)** | Full emergency brake + alert | High statistical certainty \u2014 object confirmed real |\n"
        "| **0.50 \u2013 0.75 (Medium)** | Gradual deceleration + heightened sensor polling | Likely real \u2014 begin cautionary maneuver while verifying |\n"
        "| **0.35 \u2013 0.50 (Low-Medium)** | Activate LiDAR/RADAR, slow 20%, alert driver | Ambiguous \u2014 hedge risk, do not ignore |\n"
        "| **< 0.35 (Low)** | Log for model retraining | Likely noise \u2014 but valuable training data |\n"
        "\n"
        "At **0.35**, the Daladala detection falls in the **Low-Medium zone**. The autonomous vehicle should NOT perform a sudden emergency stop (which could cause a rear-end collision), but it MUST NOT ignore the detection. The correct response: **reduce speed, activate supplementary sensors, and transfer control-priority to the driver** \u2014 while logging the frame for model improvement.\n"
        "\n"
        "**The Asymmetry of Risk:** In autonomous driving, the cost of a **False Negative** (ignoring a real Daladala and hitting it) is catastrophically higher than a **False Positive** (decelerating for a ghost detection). Safety thresholds must therefore always err on the side of caution for pedestrian and vehicle classes.\n"
        "\n"
        "**PM's Conclusion:** Threshold-setting is not a pure math problem \u2014 it is a **product ethics and risk management decision**. For Tanzania's dense urban traffic, we recommend a hard-action threshold of >= 0.60, with a cautionary sensor-fusion response for scores between 0.35\u20130.60, and mandatory data logging for all detections below 0.35 to continuously improve the model through an active learning loop.\n"
        "\n"
        "---"
    ),
}

found = {}
for cell in nb['cells']:
    cell_id = cell.get('metadata', {}).get('id', '')
    if cell_id in answers:
        # Convert the answer string into a list of lines as Jupyter expects
        answer_text = answers[cell_id]
        lines = []
        for line in answer_text.split('\n'):
            lines.append(line + '\n')
        # Remove the trailing \n from the last line
        if lines:
            lines[-1] = lines[-1].rstrip('\n')
        cell['source'] = lines
        found[cell_id] = True

print('Updated cells:')
for k in answers:
    status = "YES" if found.get(k) else "NOT FOUND"
    print(f'  {k}: {status}')

with open(nb_path, 'w', encoding='utf-8') as f:
    json.dump(nb, f, ensure_ascii=False, indent=2)

print('\nDone. Notebook saved successfully.')
