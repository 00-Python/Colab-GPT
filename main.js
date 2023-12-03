const getCompletion = async (messages, model = 'gpt-4', temperature = 1, topProbability = 1) => {
    const key = "";
    const url = 'https://api.openai.com/v1/chat/completions';

    const data = {
        messages: messages,
        model: model,
        temperature: temperature,
        top_p: topProbability,
        stream: false
    };

    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify(data),
    });

    const completion = await completionResponse.json();
    return completion.choices[0].message.content;
}

document.addEventListener("keydown", async (event) => {
    if (event.shiftKey && event.altKey && event.code === "Enter") {
        var s = "";
        var cells = window.colab.global.notebook.cells;
        for (var i = 0; i < cells.length; i++) {
            var cell = cells[i];
            if (cell.getText().includes("#Collectme")) {
                s += "\n\n" + cell.getText();
            }
            if (cell == window.colab.global.notebook.focusedCell) {
                break;
            }
        }
        var prompt = window.colab.global.notebook.focusedCell.getText();
        var text = "A solution manual which has FAQs and answers without quotation marks in Python 3 for Google Colab notebooks\n\nQuestion: " + prompt + "\nAppend code to this:" + s + "\nAnswer:";
        window.colab.global.notebook.focusedCell.setText("'''Retrieving data...'''");
        var messages = [
            {
                'role': 'system',
                'content': text
            }
        ];
        var output = (await getCompletion(messages)).trim();
        var c = "\n";
        var re = new RegExp("^[" + c + "]+|[" + c + "]+$", "g");
        output = output.replace(re, "");
        c = "`";
        re = new RegExp("^[" + c + "]+|[" + c + "]+$", "g");
        output = output.replace(re, "");
        window.colab.global.notebook.focusedCell.setText(output.trim());
    }
});

