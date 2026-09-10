package br.com.celebra.convite;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.WebView;
import android.graphics.Color;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.ImageView;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final String BASE_URL =
        "https://celebra-convite.vercelsistemas.workers.dev/e/";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        abrirConviteDoIntent(getIntent());
        mostrarCapa();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        abrirConviteDoIntent(intent);
        mostrarCapa();
    }

    private void mostrarCapa() {
        final ViewGroup raiz = findViewById(android.R.id.content);
        if (raiz == null) return;

        final FrameLayout capa = new FrameLayout(this);
        capa.setBackgroundColor(Color.rgb(242, 211, 200));

        final ImageView imagem = new ImageView(this);
        float proporcaoTela =
                (float) getResources().getDisplayMetrics().heightPixels
                / getResources().getDisplayMetrics().widthPixels;

        imagem.setImageResource(
                proporcaoTela >= 1.9f
                        ? R.drawable.capa_convidado_9x20
                        : R.drawable.capa_convidado
        );
        imagem.setScaleType(ImageView.ScaleType.CENTER_CROP);
        imagem.setAdjustViewBounds(false);

        capa.addView(imagem, new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        final View botao = new View(this);
        botao.setContentDescription("Abrir meu convite");
        botao.setClickable(true);
        capa.addView(botao, new FrameLayout.LayoutParams(1, 1));

        raiz.addView(capa, new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));

        capa.post(() -> {
            if (imagem.getDrawable() == null) return;

            float larguraTela = capa.getWidth();
            float alturaTela = capa.getHeight();
            float larguraOriginal = imagem.getDrawable().getIntrinsicWidth();
            float alturaOriginal = imagem.getDrawable().getIntrinsicHeight();
            float escala = Math.max(
                larguraTela / larguraOriginal,
                alturaTela / alturaOriginal
            );

            float larguraImagem = larguraOriginal * escala;
            float alturaImagem = alturaOriginal * escala;
            float inicioX = (larguraTela - larguraImagem) / 2f;
            float inicioY = (alturaTela - alturaImagem) / 2f;

            FrameLayout.LayoutParams posicao = new FrameLayout.LayoutParams(
                (int) (larguraImagem * 0.60f),
                (int) (alturaImagem * 0.09f)
            );
            posicao.leftMargin = (int) (inicioX + larguraImagem * 0.20f);
            posicao.topMargin = (int) (inicioY + alturaImagem * 0.76f);
            botao.setLayoutParams(posicao);
        });

        View.OnClickListener abrirConvite = view -> raiz.removeView(capa);
        botao.setOnClickListener(abrirConvite);
        capa.setOnClickListener(abrirConvite);
    }

    private void abrirConviteDoIntent(Intent intent) {
        if (intent == null || intent.getData() == null || bridge == null) {
            return;
        }

        Uri uri = intent.getData();

        if (!"celebra".equalsIgnoreCase(uri.getScheme()) ||
            !"convite".equalsIgnoreCase(uri.getHost())) {
            return;
        }

        String codigo = uri.getLastPathSegment();

        if (codigo == null || codigo.trim().isEmpty()) {
            return;
        }

        final String destino = BASE_URL + Uri.encode(codigo.trim());
        final WebView webView = bridge.getWebView();

        if (webView == null) {
            return;
        }

        webView.post(() -> webView.loadUrl(destino));
    }
}
